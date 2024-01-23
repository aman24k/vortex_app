import SQLITE from 'react-native-sqlite-storage';
SQLITE.enablePromise(true);
const database = SQLITE.openDatabase({
  name: 'vortex_db',
  location: 'default',
});

const initDB = () => {
  database.then(db => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS contacts(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), landline INT(10))
        `,
        [],
        () => {
          console.log('table created successfully');
        },
      );
    });
  });
};
initDB();

const useDB = () => {
  const runQuery = async (query: string, type?: 'select') => {
    return new Promise((resolve, reject) => {
      database.then(db => {
        db.transaction(txn => {
          txn.executeSql(
            query,
            [],
            (_tx, result) => {
              if (type === 'select') {
                const data: any = [];
                for (let i = 0; i < result.rows.length; i++) {
                  data.push(result.rows.item(i));
                }
                resolve(data);
              }
              resolve(result);
            },
            error => {
              reject(error);
            },
          );
        });
      });
    });
  };
  return {runQuery};
};

export default useDB;
