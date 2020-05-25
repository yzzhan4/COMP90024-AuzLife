//const nano = require('nano')('http://admin:90024@localhost:5984');
const nano = require('nano')('http://admin:90024@172.26.131.147:5984');

const dbAge = nano.use('aurin_age')
const dbEdu = nano.use('aurin_edu')

function Age_sumByCity_All(){
  dbAge.view('DesignCity', 'sumByCity_All', {
    //'keys':['Melbourne'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_sumByState_All(){
  dbAge.view('DesignState', 'sumByState_All', {
    //'keys':['VIC'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Edu_sumByCity_All(){
  dbEdu.view('DesignDoc', 'sumByCity_All', {
    //'keys':['VIC'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}
function Edu_sumByState_All(){
  dbEdu.view('DesignDoc', 'sumByState_All', {
    //'keys':['VIC'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}
//Age_sumByCity_All()
//Age_sumByState_All()
Edu_sumByCity_All()
Edu_sumByState_All()