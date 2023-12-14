function generatePolicy(user, effect, resource) {
  const authResponse: Record<string, any> = {};
  authResponse.principalId = user.uuid || user.id;
  if (effect && resource) {
    const policyDocument: Record<string, any> = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne: Record<string, any> = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}

export function masterKey(event, context, callback) {
  if (
    !(
      event.authorizationToken &&
      event.authorizationToken.split(' ')[1] === process.env.MASTER_KEY
    )
  ) {
    callback(null, generatePolicy({ id: 1 }, 'Deny', event.methodArn));
  }

  callback(
    null,
    generatePolicy({ id: 1, name: 'MasterKeyUser' }, 'Allow', event.methodArn),
  );
}
