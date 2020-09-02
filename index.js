#!/usr/bin/env node
//=============================================================================
//  Copyright 2019-2020 Opplaud LLC and other contributors. MIT licensed.
//=============================================================================


const kFs = require( 'fs' );

const fDie = function( sMsg, iErr ) {
  global.console.log( 'FATAL ERROR IN: ' + sMsg );
  global.console.log( iErr );
  global.process.exit(2);
  };

const hConfig = JSON.parse(
  kFs.readFileSync( global.process.argv[2], {encoding:'utf8'} ) );

const iConn = require('mysql').createConnection( hConfig );

iConn.connect( function( iErr ) { // connect to db

  if ( iErr )
    fDie( 'connect', iErr );


  //  Retrieve the table names into aTables (as aTables[x][0]),
  //  and build the output code for each column in each table.

  iConn.query( 'SHOW TABLES', ( iErr, aTableRows ) => { // tables

    if ( iErr )
      fDie( 'show tables' , iErr );

    const hSchema = { '//': {
      zAuthor: 'mysqlgoose-schema-js',
      zDatabase: hConfig[ 'database' ],
      zServer: hConfig[ 'server' ],
      zStamp: (new Date()).toISOString()
      } };

    iConn.query( // keys
      'SELECT table_name, column_name, ' +
        'referenced_table_name, referenced_column_name ' +
        'FROM INFORMATION_SCHEMA.key_column_usage ' +
        "WHERE referenced_table_schema = '" + hConfig[ 'database' ] +
        "' AND referenced_table_name IS NOT NULL " +
        'ORDER BY table_name, column_name',
      ( iErr, ahKeys ) => { // queried keys

        if ( iErr )
          fDie( 'key queries', iErr );

        hhKeys = {};
        ahKeys.forEach( hKey => {

          if ( ! hhKeys.hasOwnProperty( hKey[ 'table_name' ] ) )
            hhKeys[ hKey[ 'table_name' ] ] = {};

          hhKeys[ hKey[ 'table_name' ] ][ hKey[ 'column_name' ] ] =
            { zTable: hKey[ 'referenced_table_name' ],
              zColumn: hKey[ 'referenced_column_name' ] };

          } ); // forEach()

        Promise.all( aTableRows.map( aTableRow =>
          new Promise( ( fResolve, fReject ) => {

            const zTable = aTableRow[ 'Tables_in_' + hConfig[ 'database' ] ];
            iConn.query( // query columns
              'SELECT TABLE_SCHEMA, COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT, ' +
                  'COLUMN_KEY, NUMERIC_PRECISION, NUMERIC_SCALE ' +
                'FROM INFORMATION_SCHEMA.COLUMNS ' +
                'WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
                [ hConfig[ 'database' ], zTable ],
              ( iErr, aColumnRows ) => { // queried columns

                if ( iErr )
                  fReject( iErr );

                hSchema[ zTable ] = {};
                aColumnRows.forEach( aColumnRow => {

                  const zColumn = aColumnRow.COLUMN_NAME;

                  hSchema[ zTable ][ zColumn ] = { // col schema
                    zType: aColumnRow.DATA_TYPE,
                    vDefault: aColumnRow.COLUMN_DEFAULT
                    }; // col schema

                  [ 'NUMERIC', 'DATETIME' ].forEach( zType =>
                    [ 'Precision', 'Scale' ].forEach( zProp => {
                      const nValue = aColumnRow[ zType + '_' + zProp.toUpperCase() ];
                      if ( ( null !== nValue ) && ( undefined !== nValue ) )
                        hSchema[ zTable ][ zColumn ]
                          [ 'n' + zProp ] = nValue;
                      } ) // forEach()
                    ); // forEach()

                  if ( 'PRI' === aColumnRow.COLUMN_KEY )
                    hSchema[ zTable ][ zColumn ].bPrimary = true;

                  if ( hhKeys.hasOwnProperty( zTable ) &&
                    hhKeys[ zTable ].hasOwnProperty( zColumn ) )
                      hSchema[ zTable ][ zColumn ].hReferences =
                        hhKeys[ zTable ][ zColumn ];

                  } ); // forEach()

                fResolve();

                } // queried columns
              ) // query columns
            } ) // Promise()
          ) ). // all()
        then( // queried all tables
          () => {
            if ( 3.5 < global.process.argv.length )
              require( 'fs' ).writeFileSync(
                global.process.argv[ 3 ], JSON.stringify( hSchema ) );
            else
              console.log( JSON.stringify( hSchema, null, 2 ) );
            global.process.exit( 0 );
            },
          iErr => fDie( 'columns', iErr )
          ); // queried all tables

      } ); // query() // keys

    } ); // query() // tables

  } ); // connect to db

// EOF
