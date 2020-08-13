import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const issueMessage: string = core.getInput('issue-message');
    if (!issueMessage) {
      throw new Error(
        'Action must have at least one of issue-message set'
      );
    }
    // Get client and context
    const client: github.GitHub = new github.GitHub(
      core.getInput('repo-token', {required: true})
    );
    const context = github.context;

    if (context.payload.action !== 'opened') {
      console.log('No issue was opened, skipping');
      return;
    }

    // Do nothing if its not an issue
    if (!context.payload.issue) {
      console.log(
        'The event that triggered this action was not an issue, skipping.'
      );
      return;
    }

    const issue: {owner: string; repo: string; number: number} = context.issue;

    // Add a comment to the issue
    console.log(`Adding message: ${issueMessage} to issue ${issue.number}`);
    await client.issues.createComment({
      owner: issue.owner,
      repo: issue.repo,
      issue_number: issue.number,
      body: issueMessage
    });
  } catch (error) {
    core.setFailed(error.message);
    return;
  }
}

run();
