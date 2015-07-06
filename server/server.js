var gazejs = require("./gazejs")
var eyeTracker = gazejs.createEyeTracker(gazejs.TOBII_GAZE_SDK);
var listener = {
    onStart:function(){
        console.log("OnStart");
    },
    onStop:function(){
        console.log("OnStop");
    },
    onError:function(error){
        console.log(error);
    },
    onGazeData:function(gazeData){
        console.log('\033[2J');
        console.log(gazeData);
    }
};

eyeTracker.init();
eyeTracker.setListener(listener);

console.log("Library version: "+eyeTracker.getLibraryVersion());
console.log("Model name: "+eyeTracker.getModelName());

eyeTracker.start();

/*Stop eye tracking after 20 seconds*/
setTimeout(function(){
    eyeTracker.release();
},20000);