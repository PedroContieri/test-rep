/* Global execution control variables. */
var end = false, allRun, ftc = true, execop = "", execspeed = 1000, ftcstate = "";

/* Execute one cycle and update the UI */
var runNext = function(){
  $("button").prop("disabled", true);
  var nxt = next();
  $("#nextbut").prop("disabled", end);
  $("#resetbut").prop("disabled", false);
  update_UI();
};

/* Execute one instruction (fetch + execute cycles) */
var runStep = function()
{
  runNext();
  runNext();
  $("#stepbut").prop("disabled", end);
  if(end) { 
    window.clearInterval(allRun); 
  }
};

/* Execute all code. */
var runAll = function()
{
  allRun = window.setInterval(runNext, execspeed);
};

/* Execute one cycle. */
var next = function()
{
  try{
    if (ftc) {
      ftc = false;
      ftcstate = IAS.getCPU("ctrl"," ") 
      IAS.fetch();
    } else{
      ftc = true;
	console.log("IAS.execute()");
      IAS.execute();
    }
    
  } 
  catch(exception) {
    end = true;
    alert("PROGRAM ABORTED" + "\n" +
          "exception name: " + exception.name + "\n" +
          "exception message: " + exception.message);
    window.clearInterval(allRun);
    return;
  }
};

/* Reset the IAS machine. */
var resetAll = function()
{
  $("button").prop("disabled", false);
  update_UI();
  update_UI_IAS_dataflow("reset");
  IAS.reset();
  end = false;
  ftc = true;
  window.clearInterval(allRun); 
};

/* Set the execution run speed. */
var setSpeed = function()
{
  var spdd = document.getElementById("speedset").value;
  if(Number(spdd) <= 0)
    execspeed = 1000;
  else
    execspeed = Number(spdd);
};

/* Reset the system. */
var reboot = function()
{
  IAS.zeroAllRegisters();
  resetAll();
  cleanMemoryMap();
  return;
}

/* Set all memory as zero */
var cleanMemoryMap = function(){
	var mmap = "";
	for(var i = 0; i<1024; i++){
		if(i<0x10)
			mmap += "00"
		if(i<0x100)
			mmap += "000"
		
		mmap += i.toString(16) + " 00 00 00 00 00\n"
	}
	 IAS.loadRAM(mmap);
}

/* Validate numeric entry box */
var validateNumber = function (event) 
{
  var key = window.event ? event.keyCode : event.which;

  if (event.keyCode === 8 || event.keyCode === 46
      || event.keyCode === 37 || event.keyCode === 39) 
    return true;
  else if ( key < 48 || key > 57 ) 
    return false;
  else 
    return true;
};
