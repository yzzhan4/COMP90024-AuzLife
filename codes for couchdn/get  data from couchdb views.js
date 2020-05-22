//const nano = require('nano')('http://admin:90024@localhost:5984');
const nano = require('nano')('http://admin:90024@172.26.131.147:5984');

//use an existing database:

//const db = nano.db.use('aurin_income');

//db.list().then((body) => {  
//	body.rows.forEach((doc) => {    
//			console.log(doc);  });});

//nano.db.create('alice');
//const alice = nano.use('alice')
//alice.insert({ _id: 'myid2', happy: true }).then((body) => {
//  console.log(body)
//})
//const alice = nano.use('aurin_income')
/*alice.list().then((body) => {  
	body.rows.forEach((doc) => {    
            console.log(doc);  });});
*/
           
//带参数
/*alice.list({include_docs: true}).then((body) => {  
    body.rows.forEach((doc) => {    
        // output each document's body    
        console.log(doc.doc);  
});});
*/


//alice.insert({ happy: true }, ).then((body) => {
  // do something
//});

/*
alice.view('DesignDoc', 'getdata', {
    'include_docs': true
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.value);
    });
  });
*/

//=================================== get views of Income
function Income_getData(){
  dbIncome.view('DesignDoc', 'getData', {
    'include_docs': true,
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc);
    });
  });
}

function Income_viewsumByCity(){
  dbIncome.view('DesignDoc', 'sumByCity', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true',
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Income_viewnumOfCity(){
  dbIncome.view('DesignDoc', 'numOfCity', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

//=================================== get views of Age========================
//------------function for city reduce views-----------------
function Age_viewnumOfCity(){
  dbAge.view('DesignCity', 'numOfCity', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByCity_0_4(){
  dbAge.view('DesignCity', 'sumByCity_0_4', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByCity_5_9(){
  dbAge.view('DesignCity', 'sumByCity_5_9', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByCity_10_14(){
  dbAge.view('DesignCity', 'sumByCity_10_14', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByCity_15_19(){
  dbAge.view('DesignCity', 'sumByCity_0_4', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByCity_20_24(){
  dbAge.view('DesignCity', 'sumByCity_20_24', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByCity_25_29(){
  dbAge.view('DesignCity', 'sumByCity_25_29', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByCity_30_34(){
  dbAge.view('DesignCity', 'sumByCity_30_34', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByCity_35_39(){
  dbAge.view('DesignCity', 'sumByCity_35_39', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByCity_40_44(){
  dbAge.view('DesignCity', 'sumByCity_40_44', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByCity_45_49(){
  dbAge.view('DesignCity', 'sumByCity_45_49', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByCity_50_54(){
  dbAge.view('DesignCity', 'sumByCity_50_54', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

//------------function for state reduce views-----------------
function Age_viewnumOfState(){
  dbAge.view('DesignState', 'numOfState', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByState_0_4(){
  dbAge.view('DesignState', 'sumByState_0_4', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByState_5_9(){
  dbAge.view('DesignState', 'sumByState_5_9', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByState_10_14(){
  dbAge.view('DesignState', 'sumByState_10_14', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByState_15_19(){
  dbAge.view('DesignState', 'sumByState_0_4', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByState_20_24(){
  dbAge.view('DesignState', 'sumByState_20_24', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByState_25_29(){
  dbAge.view('DesignState', 'sumByState_25_29', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByState_30_34(){
  dbAge.view('DesignState', 'sumByState_30_34', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByState_35_39(){
  dbAge.view('DesignState', 'sumByState_35_39', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByState_40_44(){
  dbAge.view('DesignState', 'sumByState_40_44', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByState_45_49(){
  dbAge.view('DesignState', 'sumByState_45_49', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_viewsumByState_50_54(){
  dbAge.view('DesignState', 'sumByState_50_54', {
    //'keys':['Melbourne','Brisbane'],
    'group':'true'
    
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc.key,doc.value);
    });
  });
}

function Age_getData(){
  dbAge.view('DesignData', 'getdata', {
    'include_docs': true,
  }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc);
    });
  });
}




//==========================use view functions==================
//-------------connnect databases-------------
const dbAge = nano.use('aurin_age')
const dbIncome = nano.use('aurin_income')
//-------------aurin_income-----------------
//Income_viewnumOfCity()
//Income_viewsumByCity()
//Income_getData()


//-------------aurin_age--------------------
//Age_getData()
Age_viewnumOfCity()
//Age_viewsumByCity_0_4()
//Age_viewsumByCity_5_9()
//Age_viewsumByCity_10_14()
//Age_viewsumByCity_15_19()
//Age_viewsumByCity_20_24()
//Age_viewsumByCity_25_29()
//Age_viewsumByCity_30_34()
//Age_viewsumByCity_35_39()
//Age_viewsumByCity_40_44()
//Age_viewsumByCity_45_49()
//Age_viewsumByCity_50_54()

//Age_viewnumOfState()
//Age_viewsumByState_0_4()
//Age_viewsumByState_5_9()
//Age_viewsumByState_10_14()
//Age_viewsumByState_15_19()
//Age_viewsumByState_20_24()
//Age_viewsumByState_25_29()
//Age_viewsumByState_30_34()
//Age_viewsumByState_35_39()
//Age_viewsumByState_40_44()
//Age_viewsumByState_45_49()
//Age_viewsumByState_50_54()
