import dataSource from '../../src/utils/dataSource';
const resetDb = {
  async reset() {
    //resets db to initial state deleteing all data of tables used in user actions
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    await dataSource.manager.query(`
    DELETE FROM TRAINNING_BLOCK_EXERCISE;
    DELETE FROM EXERCISE_MUSCLE_IMPACT;
    DELETE FROM EXERCISE_BLOCKS_BLOCK;
    DELETE FROM EXERCISE;
    DELETE FROM TRAINNING_BLOCK;
    DELETE FROM TRAINNING;
    DELETE FROM BOX;
    DELETE FROM COACH;`);
  },
};

export default resetDb;
