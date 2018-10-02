'use strict';

const http = require('http');
const { postgraphile } = require('postgraphile');

// plugins
const NonNullRelationsPlugin = require('./plugins/NonNullRelationsPlugin');
const PgSimplifyInflectorPlugin = require('@graphile-contrib/pg-simplify-inflector');

// constants
const postgresUser = process.env.POSTGRES_USER;
const postgresPassword = process.env.POSTGRES_PASSWORD;
const postgresDb = process.env.POSTGRES_DB;
const noAuth = process.env.NO_AUTH === 'true';

console.log(`Starting PostGraphile${noAuth ? ' in no-auth mode' : ''}...\n`);

http
  .createServer(
    postgraphile(
      `postgres://${postgresUser}:${postgresPassword}@postgres:5432/${postgresDb}`,
      'public', // introspected schema
      {
        classicIds: true,
        dynamicJson: true,
        setofFunctionsContainNulls: false,
        pgDefaultRole: noAuth ? 'viewer' : 'anonymous',
        disableDefaultMutations: true,
        disableQueryLog: false,
        jwtSecret: process.env.POSTGRAPHILE_JWT_SECRET,
        graphiql: true,
        watchPg: true,
        jwtPgTypeIdentifier: 'private.jwt_token',
        graphileBuildOptions: {
          pgStrictFunctions: true,
        },
        appendPlugins: [PgSimplifyInflectorPlugin, NonNullRelationsPlugin],
      },
    ),
  )
  .listen(process.env.POSTGRAPHILE_PORT);
