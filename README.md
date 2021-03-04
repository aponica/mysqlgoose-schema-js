# @aponica/mysqlgoose-schema-js

Generates a JSON hash (dictionary) object of mysql table schemas, indexed by 
table name, to be used by 
[@aponica/mysqlgoose-js](https://aponica.com/docs/mysqlgoose-js/)
to create models.

<a name="execution"></a>
## Execution

```sh
npx @aponica/mysqlgoose-schema-js zConfigFile [ zOutFile ]
```

`zConfigFile` must be a JSON file containing the database connection data.
It must contain an object with members as expected by 
[mysqljs/mysql](https://github.com/mysqljs/mysql):

```json
{"database":"mysqlgoose_test",
"host":"localhost",
"password":"password",
"user":"mysqlgoose_tester"}
```
 
If `zOutFile` is specified, the output is saved to a file with this name,
without whitespace. If the file exists, it is overwritten. If not specified, 
output is to stdout w/two-space indentation.


## Please Donate!

Help keep a roof over our heads and food on our plates! 
If you find aponica® open source software useful, please 
**[<u>click here</u>](https://www.paypal.com/biz/fund?id=BEHTAS8WARM68)** 
to make a one-time or recurring donation via *PayPal*, credit 
or debit card. Thank you kindly!

## Contributing

Your interest is appreciated! Please read the main project documentation at 
[@aponica/mysqlgoose-js](https://aponica.com/docs/mysqlgoose-js/).

## Copyright

Copyright 2019-2021 Opplaud LLC and other contributors.

## License

MIT License.

## Trademarks

OPPLAUD and aponica are registered trademarks of Opplaud LLC.

## Related Links

Official links for this project:

* [Home Page & Online Documentation](https://aponica.com/docs/mysqlgoose-schema-js/)
* [GitHub Repository](https://github.com/aponica/mysqlgoose-schema-js)
* [NPM Package](https://www.npmjs.com/package/@aponica/mysqlgoose-schema-js)
  
Related projects:

* [@aponica/mysqlgoose-js](https://aponica.com/docs/mysqlgoose-js/)
* [@mysqljs/mysql](https://github.com/mysqljs/mysql#readme)
