import { ConnectorBase } from "@grayscale/connector-core";
import type {
  ConnectorCredentials,
  AuthResult,
  ConnectionContext,
  FetchQuery,
  RawProviderPayload,
  ConnectorHealthState,
} from "@grayscale/platform";

interface GitHubCommit {
  sha: string;
  commit: { message: string; author: { date: string } };
  html_url: string;
}

/** AIP-20 — GitHub production connector */
export class GitHubConnector extends ConnectorBase {
  readonly displayName = "GitHub";
  readonly version = "1.0.0";
  readonly supportedAuth = ["pat", "oauth2"] as const;
  readonly supportedResources = ["commits", "pull_requests", "issues"] as const;

  constructor() {
    super("github");
  }

  async authenticate(credentials: ConnectorCredentials): Promise<AuthResult> {
    if (!credentials.accessToken) {
      return { success: false, error: "Access token required" };
    }
    return { success: true, credentials };
  }

  async refreshAuth(refreshToken: string): Promise<AuthResult> {
    void refreshToken;
    return { success: false, error: "GitHub PAT does not support refresh in this connector" };
  }

  protected async ping(ctx: ConnectionContext): Promise<{ state: ConnectorHealthState; message?: string }> {
    const config = ctx.config as { owner?: string; repo?: string };
    if (!config.owner || !config.repo) {
      return { state: "configuration_error", message: "owner/repo not configured" };
    }
    const res = await this.apiFetch(ctx, `/repos/${config.owner}/${config.repo}`);
    if (res.status === 401) return { state: "authentication_failed", message: "Invalid token" };
    if (res.status === 403) return { state: "rate_limited", message: "Rate limited" };
    if (!res.ok) return { state: "offline", message: `HTTP ${res.status}` };
    return { state: "healthy" };
  }

  async fetchResources(ctx: ConnectionContext, query: FetchQuery): Promise<RawProviderPayload[]> {
    const config = ctx.config as { owner?: string; repo?: string };
    if (!config.owner || !config.repo) {
      throw new Error("GitHub owner/repo not configured");
    }

    if (query.resourceType === "commits") {
      return this.withRetry(async () => {
        const res = await this.apiFetch(
          ctx,
          `/repos/${config.owner}/${config.repo}/commits?per_page=${query.limit ?? 10}`,
        );
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const commits = (await res.json()) as GitHubCommit[];
        return commits.map((c) =>
          this.buildPayload("commits", c.sha, c, c.html_url),
        );
      }, "fetchCommits");
    }

    return [];
  }

  private async apiFetch(ctx: ConnectionContext, path: string): Promise<Response> {
    const token = ctx.credentials.accessToken;
    if (!token) throw new Error("No access token");

    return fetch(`https://api.github.com${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  }
}

export const githubConnector = new GitHubConnector();
