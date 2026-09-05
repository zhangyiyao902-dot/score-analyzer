const STORAGE_KEY = "highSchoolScores_v1";
const defaultSubjects = [
  { name: "语文", score: "" },
  { name: "数学", score: "" },
  { name: "英语", score: "" }
];
let subjects = loadSubjects();
const subjectList = document.getElementById("subjectList");
const emptyState = document.getElementById("emptyState");
const totalScore = document.getElementById("totalScore");
const averageScore = document.getElementById("averageScore");
const subjectCount = document.getElementById("subjectCount");
const addSubjectBtn = document.getElementById("addSubjectBtn");
const clearBtn = document.getElementById("clearBtn");

function cloneDefaults() { return defaultSubjects.map(item => ({ ...item })); }
function loadSubjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return cloneDefaults();
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return cloneDefaults();
    return parsed.filter(item => item && typeof item.name === "string")
      .map(item => ({ name:item.name, score:item.score === "" ? "" : Number(item.score) }));
  } catch { return cloneDefaults(); }
}
function saveSubjects() { localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects)); }
function getValidScores() { return subjects.map(item => Number(item.score)).filter(score => Number.isFinite(score) && score >= 0); }
function updateSummary() {
  const scores = getValidScores();
  const total = scores.reduce((sum, score) => sum + score, 0);
  totalScore.textContent = Number.isInteger(total) ? total : total.toFixed(1);
  averageScore.textContent = scores.length ? (total / scores.length).toFixed(1) : "0.0";
  subjectCount.textContent = scores.length;
}
function render() {
  subjectList.innerHTML = "";
  subjects.forEach((subject,index) => {
    const row = document.createElement("div"); row.className = "subject-row";
    const nameInput = document.createElement("input");
    nameInput.className="subject-name"; nameInput.type="text"; nameInput.value=subject.name; nameInput.placeholder="科目名称"; nameInput.maxLength=20;
    nameInput.addEventListener("input", e => { subjects[index].name=e.target.value; saveSubjects(); });
    const scoreInput = document.createElement("input");
    scoreInput.className="score-input"; scoreInput.type="number"; scoreInput.inputMode="decimal"; scoreInput.min="0"; scoreInput.max="1000"; scoreInput.step="0.1"; scoreInput.placeholder="成绩"; scoreInput.value=subject.score;
    scoreInput.addEventListener("input", e => { subjects[index].score=e.target.value==="" ? "" : Number(e.target.value); saveSubjects(); updateSummary(); });
    const deleteBtn=document.createElement("button"); deleteBtn.className="delete-btn"; deleteBtn.type="button"; deleteBtn.textContent="×"; deleteBtn.title="删除此科目";
    deleteBtn.addEventListener("click",()=>{ subjects.splice(index,1); saveSubjects(); render(); });
    row.append(nameInput,scoreInput,deleteBtn); subjectList.appendChild(row);
  });
  emptyState.style.display=subjects.length ? "none" : "block";
  updateSummary();
}
addSubjectBtn.addEventListener("click",()=>{ subjects.push({name:"",score:""}); saveSubjects(); render(); document.querySelectorAll(".subject-name").at(-1)?.focus(); });
clearBtn.addEventListener("click",()=>{ if (!subjects.length) return; if (window.confirm("确定要清空全部成绩吗？")) { subjects=[]; saveSubjects(); render(); } });
render();
