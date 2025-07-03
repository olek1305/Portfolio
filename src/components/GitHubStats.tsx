import React, {useState, useEffect, useCallback} from 'react';
import Image from 'next/image';

interface GitHubStatsProps {
  username: string;
  onClose?: () => void;
  className?: string;
}

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  bio: string;
}

interface Repository {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
  updated_at: string;
}

interface GitHubStats {
  user: GitHubUser | null;
  repositories: Repository[];
  totalCommits: number;
  totalStars: number;
  topLanguages: { [key: string]: number };
  loading: boolean;
  error: string | null;
}

const GitHubStats: React.FC<GitHubStatsProps> = ({ username, onClose, className = '' }) => {
  const [stats, setStats] = useState<GitHubStats>({
    user: null,
    repositories: [],
    totalCommits: 0,
    totalStars: 0,
    topLanguages: {},
    loading: true,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'repos'>('overview');
  const CACHE_KEY = `github_stats_${username}`;
  const CACHE_EXPIRY = 60 * 60 * 1000;

  const saveToCache = useCallback((data: GitHubStats) => {
    const cacheData = {
      timestamp: new Date().getTime(),
      data: data
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  }, [CACHE_KEY]);

  const loadFromCache = useCallback((): GitHubStats | null => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    const now = new Date().getTime();

    if (now - parsed.timestamp < CACHE_EXPIRY) {
      return parsed.data;
    }

    return null;
  }, [CACHE_KEY, CACHE_EXPIRY]);

  useEffect(() => {
    const controller = new AbortController();

    const checkForRateLimitError = async (response: Response): Promise<boolean> => {
      if (response.status === 403) {
        try {
          const responseText = await response.text();
          const isRateLimitError = responseText.includes('API rate limit exceeded');

          if (isRateLimitError) {
            setStats(prev => ({
              ...prev,
              loading: false,
              error: 'API rate limit exceeded for your IP address. (But here\'s the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)'
            }));
            return true;
          }
        } catch (error) {
          console.error('Error checking for rate limit:', error);
        }
      }
      return false;
    };

    const fetchGitHubStats = async () => {
      const cachedData = loadFromCache();
      if (cachedData) {
        setStats(cachedData);
        return;
      }

      try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
          const isRateLimited = await checkForRateLimitError(userResponse);
          if (isRateLimited) return;

          setStats(prev => ({
            ...prev,
            loading: false,
            error: `GitHub API error: ${userResponse.status} ${userResponse.statusText}`
          }));
          return;
        }
        const userData: GitHubUser = await userResponse.json();

        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!reposResponse.ok) {
          const isRateLimited = await checkForRateLimitError(reposResponse);
          if (isRateLimited) return;

          setStats(prev => ({
            ...prev,
            loading: false,
            error: `GitHub API error: ${reposResponse.status} ${reposResponse.statusText}`
          }));
          return;
        }

        const reposData: Repository[] = await reposResponse.json();

        let totalStars = 0;
        const languages: { [key: string]: number } = {};

        reposData.forEach((repo) => {
          totalStars += repo.stargazers_count;
          if (repo.language && repo.language !== 'null') {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
          }
        });

        const topLanguages = Object.fromEntries(
            Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 5)
        );

        const totalCommits = reposData.length * 15;

        const newStats = {
          user: userData,
          repositories: reposData.sort((a, b) => b.stargazers_count - a.stargazers_count),
          totalCommits,
          totalStars,
          topLanguages,
          loading: false,
          error: null,
        };

        saveToCache(newStats);
        setStats(newStats);
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        let errorMessage = 'Unknown error';

        if (error instanceof Error) {
          errorMessage = error.message;
          if (errorMessage.includes('API rate limit exceeded')) {
            errorMessage = 'API rate limit exceeded for your IP address. (But here\'s the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)';
          }
        }

        setStats({
          user: null,
          repositories: [],
          totalCommits: 0,
          totalStars: 0,
          topLanguages: {},
          loading: false,
          error: errorMessage,
        });
      }
    };

    fetchGitHubStats();

    return () => {
      controller.abort();
    };
  }, [username, loadFromCache, saveToCache]);

  if (stats.loading) {
    return (
        <div className={`hl-container h-full text-center animate-pulse ${className}`}>
          <h3 className="hl-title">GitHub Stats</h3>
          <div className="h-full flex items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-400 border-r-transparent">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
    );
  }

  if (stats.error) {
    const isRateLimitError = stats.error.includes('API rate limit exceeded');

    return (
        <div className={`hl-container h-full ${className}`}>
          <div className="p-4 text-center block" style={{ height: 'calc(100% - 30px)', overflow: 'hidden !important' }}>
            {isRateLimitError ? (
                <div>
                  <div className="bg-red-900/30 border border-orange-600 rounded-md p-4 text-orange-400 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    <h4 className="text-lg font-bold mb-2">GitHub API Rate Limit Exceeded</h4>
                    <p className="text-gray-300">You&#39;ve reached GitHub&#39;s API rate limit for unauthenticated requests.</p>
                    <div className="mt-4 text-sm text-gray-400">
                      <p>&quot;API rate limit exceeded for your IP address. (But here&#39;s the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)&quot;</p>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] p-4 rounded-lg mb-4 border border-orange-600/30">
                    <h4 className="text-orange-400 font-medium mb-2">What does this mean?</h4>
                    <ul className="text-left text-gray-300 list-disc pl-5 space-y-2">
                      <li>GitHub allows only <strong className="text-orange-400">60 requests per hour</strong> for anonymous users</li>
                      <li>Your IP address has reached this limit</li>
                      <li>This is temporary and will reset automatically after 60 minutes</li>
                    </ul>
                  </div>

                  <div className="bg-[#0a0a0a] p-4 rounded-lg border border-orange-600/30">
                    <h4 className="text-orange-400 font-medium mb-2">What can you do?</h4>
                    <ul className="text-left text-gray-300 list-disc pl-5 space-y-2">
                      <li>Wait for exactly 60 minutes for the rate limit to reset</li>
                      <li>The reset is based on a rolling 60-minute window from your first request</li>
                      <li>Visit <a href="https://github.com/olek1305" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">my GitHub profile</a> directly</li>
                    </ul>
                  </div>
                </div>
            ) : (
                <div className="text-orange-400 block" style={{ padding: '30px 0' }}>
                  <p>Error loading GitHub stats: {stats.error}</p>
                  <p className="text-sm mt-2 text-gray-400">Note: GitHub API has rate limits. Please try again later.</p>
                </div>
            )}
          </div>

          <h3 className="hl-title">GitHub Stats</h3>
        </div>
    );
  }

  return (
      <div className={`hl-container relative h-full ${className}`}>
        <h3 className="hl-title">GitHub Stats</h3>
        {onClose && (
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-orange-400 hover:text-white z-10"
                aria-label="Close GitHub Stats"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        )}

        {stats.user && (
            <div className="p-4 h-full overflow-auto">
              {/* User Profile Header - Mobile optimized */}
              <div className="flex flex-col sm:flex-row items-center mb-4">
                <div className="relative mb-4 sm:mb-0 sm:mr-4">
                  <Image
                      src={stats.user.avatar_url}
                      alt={`${stats.user.name}'s GitHub avatar`}
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-orange-400"
                      unoptimized={true}
                  />
                  <div className="absolute bottom-0 right-0 bg-green-400 rounded-full h-4 w-4 border-2 border-[#0a0a0a]"></div>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold text-orange-400">{stats.user.name || stats.user.login}</h2>
                  <a href={stats.user.html_url} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline text-sm flex items-center justify-center sm:justify-start">
                    <span>@{stats.user.login}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  {stats.user.bio && (
                      <p className="text-gray-400 text-sm mt-2 max-w-md">{stats.user.bio}</p>
                  )}
                </div>
              </div>

              {/* Tabs Navigation - Mobile optimized */}
              <div className="flex border-b border-orange-600/30 mb-4 overflow-x-auto">
                <button
                    className={`px-4 py-2 font-hl whitespace-nowrap ${activeTab === 'overview' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-orange-400'}`}
                    onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                    className={`px-4 py-2 font-hl whitespace-nowrap ${activeTab === 'repos' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-orange-400'}`}
                    onClick={() => setActiveTab('repos')}
                >
                  Repositories ({stats.repositories.length})
                </button>
              </div>

              {/* Overview Tab Content - Mobile optimized */}
              {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 gap-4 overview-tab">
                    {/* Stats Cards - Mobile optimized */}
                    <div className="bg-[#0a0a0a] p-4 rounded-lg border border-orange-600/30">
                      <h3 className="text-orange-400 text-lg mb-3 font-hl">Activity Summary</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#1a1a1a] p-3 rounded-lg text-center border border-orange-600/30">
                          <div className="text-2xl font-bold text-orange-400">{stats.user.public_repos}</div>
                          <div className="text-sm text-gray-400 font-hl">Repositories</div>
                        </div>
                        <div className="bg-[#1a1a1a] p-3 rounded-lg text-center border border-orange-600/30">
                          <div className="text-2xl font-bold text-orange-400">{stats.totalCommits}</div>
                          <div className="text-sm text-gray-400 font-hl">Est. Commits</div>
                        </div>
                        <div className="bg-[#1a1a1a] p-3 rounded-lg text-center border border-orange-600/30">
                          <div className="text-2xl font-bold text-orange-400">{stats.user.followers}</div>
                          <div className="text-sm text-gray-400 font-hl">Followers</div>
                        </div>
                        <div className="bg-[#1a1a1a] p-3 rounded-lg text-center border border-orange-600/30">
                          <div className="text-2xl font-bold text-orange-400">{stats.totalStars}</div>
                          <div className="text-sm text-gray-400 font-hl">Total Stars</div>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-400 text-center font-hl">
                        <span>GitHub member since {new Date(stats.user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Languages Chart */}
                    <div className="bg-[#0a0a0a] p-4 rounded-lg border border-orange-600/30">
                      <h3 className="text-orange-400 text-lg mb-3 font-hl">Top Languages</h3>
                      <div className="space-y-2">
                        {Object.entries(stats.topLanguages).map(([language, count]) => (
                            <div key={language} className="relative">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300 font-hl">{language}</span>
                                <span className="text-gray-400 font-hl">{count} repos</span>
                              </div>
                              <div className="w-full bg-[#1a1a1a] rounded-full h-2.5 border border-orange-600/30">
                                <div
                                    className="bg-orange-400 h-2.5 rounded-full"
                                    style={{ width: `${(count / stats.repositories.length) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                        ))}
                      </div>
                      {Object.keys(stats.topLanguages).length === 0 && (
                          <div className="text-center text-gray-400 py-4 font-hl">
                            No language data available
                          </div>
                      )}
                    </div>
                  </div>
              )}

              {/* Repositories Tab Content - Mobile optimized */}
              {activeTab === 'repos' && (
                  <div className="space-y-4 repos-tab">
                    {stats.repositories.slice(0, 5).map((repo) => (
                        <div key={repo.id} className="bg-[#0a0a0a] p-4 rounded-lg border border-orange-600/30 hover:bg-[#0f0f0f] transition duration-200">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                            <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-400 hover:underline font-medium flex items-center font-hl mb-2 sm:mb-0"
                            >
                              {repo.name}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                            <div className="flex space-x-3 text-sm">
                      <span className="flex items-center text-orange-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        {repo.stargazers_count}
                      </span>
                              <span className="flex items-center text-orange-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                                {repo.forks_count}
                      </span>
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mt-2 font-hl">{repo.description || 'No description'}</p>
                          <div className="flex flex-col sm:flex-row sm:justify-between mt-3 text-xs text-gray-500 font-hl">
                            <div className="mb-1 sm:mb-0">{repo.language || 'Unknown'}</div>
                            <div>Updated: {new Date(repo.updated_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                    ))}
                    {stats.repositories.length > 5 && (
                        <div className="text-center">
                          <a
                              href={`https://github.com/${username}?tab=repositories`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-400 hover:underline inline-block px-4 py-2 font-hl"
                          >
                            View all {stats.repositories.length} repositories
                          </a>
                        </div>
                    )}
                  </div>
              )}
            </div>
        )}
      </div>
  );
};

export default GitHubStats;