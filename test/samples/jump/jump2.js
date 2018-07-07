/**
 * Mixed runner types flow with backward jumping
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Generate a dummy task that adds
 * a key `task${id}_${callsCounter}` = `true` into the context
 * and calls its callback on the next event loop tick
 * using `setImmediate`
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateDummyTask(id) {

  var callsCounter = 1;
  
  return function(context, callback) {
    context['task' + id + '_' + callsCounter++] = true;
    setImmediate(callback);
  };

}

/**
 * Generate a dummy task that adds
 * a key `task${id}_${callsCounter}` = `true` into the context
 * and calls its callback on the next event loop tick
 * using `setImmediate` with the arguments (null, jumpToTask)
 * when it's called for the first time, otherwise without jumping
 * 
 * @param  {Number}   id
 * @return {Function}
 */
function generateJumperTask(id, jumpToTask) {

  var called = false;
  var callsCounter = 1;

  return function(context, callback) {

    context['task' + id + '_' + callsCounter++] = true;

    if (!called) {
      called = true;
      return setImmediate(callback.bind(null, null, jumpToTask));
    }

    setImmediate(callback);

  };

}

/**
 * The flow sample
 * @type {Object}
 */
module.exports.flow = {

  type: 'series',
  
  task1: generateDummyTask(1),

  group1: {

    type: 'parallel',

    task2: generateDummyTask(2),

    task3: generateDummyTask(3),

    group2: {

      type: 'series',

      task4: generateDummyTask(4),

      task5: generateDummyTask(5)

    },

    group3: {

      task6: generateDummyTask(6),

      task7: generateDummyTask(7),

      group4: {

        type: 'parallel',

        task8: generateDummyTask(8),

        task9: generateDummyTask(9)

      },

      task10: generateDummyTask(10)

    }

  },

  task11: generateJumperTask(11, 'task1'),

  task12: generateDummyTask(12)

};

/**
 * Hints for the testing suites
 * @type {Object}
 */
module.exports.hints = {};

/**
 * The state of the context object in each event loop tick
 * @type {Array}
 */
module.exports.hints.timeline = [
  {},
  {task1_1: true},
  {task2_1: true, task3_1: true, task4_1: true, task6_1: true},
  {task5_1: true, task7_1: true},
  {task8_1: true, task9_1: true},
  {task10_1: true},
  {task11_1: true},
  {task1_2: true},
  {task2_2: true, task3_2: true, task4_2: true, task6_2: true},
  {task5_2: true, task7_2: true},
  {task8_2: true, task9_2: true},
  {task10_2: true},
  {task11_2: true},
  {task12_1: true}
];

/**
 * The debug logs for each executed task
 * ordered as per the execution order
 * @type {Array}
 */
module.exports.hints.debugLogs = [
  'task1',
  '..task2',
  '..task3',
  '....task4',
  '....task6',
  '....task5',
  '....task7',
  '......task8',
  '......task9',
  '....task10',
  'task11',
  'task1',
  '..task2',
  '..task3',
  '....task4',
  '....task6',
  '....task5',
  '....task7',
  '......task8',
  '......task9',
  '....task10',
  'task11',
  'task12'
];