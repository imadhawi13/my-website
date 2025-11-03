const LS_EMPLOYEES="employees",LS_SCHEDULES="schedules",LS_EVENTS="events",LS_REPORTS="reports";
let employees=JSON.parse(localStorage.getItem(LS_EMPLOYEES))||[];
let schedules=JSON.parse(localStorage.getItem(LS_SCHEDULES))||[];
let events=JSON.parse(localStorage.getItem(LS_EVENTS))||[];
let reports=JSON.parse(localStorage.getItem(LS_REPORTS))||[];
const ADMIN_CODE="2513";

const loginModal=document.getElementById("loginModal");
const adminPanel=document.getElementById("adminPanel");
const employeePanel=document.getElementById("employeePanel");
const adminIcon=document.getElementById("adminIcon");
const employeeIcon=document.getElementById("employeeIcon");

adminIcon.onclick=()=>{
  loginModal.style.display="flex"; 
  document.getElementById("loginName").value="Admin"; 
  document.getElementById("loginCode").value=""; 
  document.getElementById("loginTitle").innerText="Admin Login";
}

employeeIcon.onclick=()=>{
  loginModal.style.display="flex";
  document.getElementById("loginName").value=""; 
  document.getElementById("loginCode").value=""; 
  document.getElementById("loginTitle").innerText="Employee Login";
}

function login(){
  const name=document.getElementById("loginName").value;
  const code=document.getElementById("loginCode").value;
  if(name.toLowerCase()==="admin" && code===ADMIN_CODE){
    loginModal.style.display="none"; adminPanel.style.display="block"; refreshAdmin();
  } else {
    const emp=employees.find(e=>e.name===name && e.code===code);
    if(emp){ loginModal.style.display="none"; employeePanel.style.display="block"; refreshEmployee(); }
    else alert("Wrong credentials!");
  }
}

function logout(){
  adminPanel.style.display="none";
  employeePanel.style.display="none";
  loginModal.style.display="flex";
  document.getElementById("loginName").value="";
  document.getElementById("loginCode").value="";
}

// --- Employees ---
function addEmployee(){
  const name=document.getElementById("empName").value;
  const code=document.getElementById("empCode").value;
  if(name && code){ 
    employees.push({name,code}); 
    localStorage.setItem(LS_EMPLOYEES,JSON.stringify(employees)); 
    document.getElementById("empName").value=""; 
    document.getElementById("empCode").value=""; 
    refreshAdmin(); 
  }
}

// --- Schedule ---
function addSchedule(){
  const text=document.getElementById("scheduleText").value;
  const files=document.getElementById("scheduleFile").files;
  if(text || files.length>0){
    const fileArray=[];
    if(files.length>0){
      for(let i=0;i<files.length;i++){
        const reader=new FileReader();
        reader.onload=(e)=>{
          fileArray.push({name:files[i].name,data:e.target.result});
          if(fileArray.length===files.length){ saveSchedule(text,fileArray); }
        }
        reader.readAsDataURL(files[i]);
      }
    } else { saveSchedule(text,[]); }
  }
}
function saveSchedule(text,files){ schedules.push({text,files}); localStorage.setItem(LS_SCHEDULES,JSON.stringify(schedules)); document.getElementById("scheduleText").value=""; document.getElementById("scheduleFile").value=""; refreshAdmin(); }

// --- Events ---
function addEvent(){
  const text=document.getElementById("eventText").value;
  const date=document.getElementById("eventDate").value;
  const files=document.getElementById("eventFile").files;
  if(text && date || files.length>0){
    const fileArray=[];
    if(files.length>0){
      for(let i=0;i<files.length;i++){
        const reader=new FileReader();
        reader.onload=(e)=>{
          fileArray.push({name:files[i].name,data:e.target.result});
          if(fileArray.length===files.length){ saveEvent(date,text,fileArray); }
        }
        reader.readAsDataURL(files[i]);
      }
    } else { saveEvent(date,text,[]); }
  }
}
function saveEvent(date,text,files){ events.push({date,text,files}); localStorage.setItem(LS_EVENTS,JSON.stringify(events)); document.getElementById("eventText").value=""; document.getElementById("eventDate").value=""; document.getElementById("eventFile").value=""; refreshAdmin(); }

// --- Reports ---
function sendReport(){
  const text=document.getElementById("empReport").value;
  const name=document.getElementById("loginName").value;
  if(text){ reports.push({employee:name,report:text}); localStorage.setItem(LS_REPORTS,JSON.stringify(reports)); document.getElementById("empReport").value=""; refreshAdmin(); }
}

// --- Refresh ---
function refreshAdmin(){
  // Employees
  const empList=document.getElementById("employeeList"); empList.innerHTML="";
  employees.forEach((e,i)=>{
    const div=document.createElement("div"); div.textContent=`👤 ${e.name} (Code: ${e.code})`;
    div.onclick=()=>{ if(confirm("Delete this employee?")){ employees.splice(i,1); localStorage.setItem(LS_EMPLOYEES,JSON.stringify(employees)); refreshAdmin(); } }
    empList.appendChild(div);
  });

  // Schedule
  const scheduleList=document.getElementById("scheduleList"); scheduleList.innerHTML="";
  schedules.forEach((s,i)=>{
    const div=document.createElement("div"); div.textContent=s.text;
    s.files.forEach(f=>{
      const link=document.createElement("a"); link.href=f.data; link.download=f.name; link.textContent=f.name; div.appendChild(link);
    })
    div.onclick=()=>{ if(confirm("Delete this schedule?")){ schedules.splice(i,1); localStorage.setItem(LS_SCHEDULES,JSON.stringify(schedules)); refreshAdmin(); } }
    scheduleList.appendChild(div);
  });

  // Events
  const eventList=document.getElementById("eventList"); eventList.innerHTML="";
  events.forEach((ev,i)=>{
    const div=document.createElement("div"); div.textContent=`${ev.date} - ${ev.text}`;
    ev.files.forEach(f=>{
      const link=document.createElement("a"); link.href=f.data; link.download=f.name; link.textContent=f.name; div.appendChild(link);
    })
    div.onclick=()=>{ if(confirm("Delete this event?")){ events.splice(i,1); localStorage.setItem(LS_EVENTS,JSON.stringify(events)); refreshAdmin(); } }
    eventList.appendChild(div);
  });

  // Reports
  const reportList=document.getElementById("reportsList"); reportList.innerHTML="";
  reports.forEach((r,i)=>{
    const div=document.createElement("div"); div.textContent=`${r.employee}: ${r.report}`;
    div.onclick=()=>{ if(confirm("Delete this report?")){ reports.splice(i,1); localStorage.setItem(LS_REPORTS,JSON.stringify(reports)); refreshAdmin(); } }
    reportList.appendChild(div);
  });
}

function refreshEmployee(){
  // Schedule
  const empScheduleList=document.getElementById("empScheduleList"); empScheduleList.innerHTML="";
  schedules.forEach(s=>{
    const div=document.createElement("div"); div.textContent=s.text;
    s.files.forEach(f=>{
      const link=document.createElement("a"); link.href=f.data; link.download=f.name; link.textContent=f.name; div.appendChild(link);
    })
    empScheduleList.appendChild(div);
  });

  // Events
  const empEventList=document.getElementById("empEventList"); empEventList.innerHTML="";
  events.forEach(ev=>{
    const div=document.createElement("div"); div.textContent=`${ev.date} - ${ev.text}`;
    ev.files.forEach(f=>{
      const link=document.createElement("a"); link.href=f.data; link.download=f.name; link.textContent=f.name; div.appendChild(link);
    })
    empEventList.appendChild(div);
  });
}
