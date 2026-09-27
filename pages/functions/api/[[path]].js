export const onRequest = ({ request, env }) => env.FRESH_SCOPE.fetch(request);
