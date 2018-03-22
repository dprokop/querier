const octokit = require('@octokit/rest')()

export const getRepositoriesForCompany = async ({company}) => {
  const results = await octokit.repos.getForUser({
    username: company
  });
  return results.data;
};
