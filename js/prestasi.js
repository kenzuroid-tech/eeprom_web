const allAchievements = [
    { year: "2024", event: "Lomba PRC Nasional - Politeknik Negeri Semarang", rank: "Best Design", desc: "Lomba Transporter" },
    { year: "2023", event: "Lomba PRC Nasional - Politeknik Negeri Semarang", rank: "Juara 2", desc: "Lomba Transporter" },
    { year: "2023", event: "Lomba PRC Nasional - Politeknik Negeri Semarang", rank: "Juara 3", desc: "Lomba Transporter" },
    { year: "2022", event: "Airofest 1.0 Nasional - Universitas Airlangga", rank: "Special Award", desc: "Line Maze" },
    { year: "2022", event: "Lomba PRC Nasional - Politeknik Negeri Semarang", rank: "Juara 2", desc: "Lomba Transporter" },
    { year: "2021", event: "TECHNOCORNER Nasional - Universitas Gadjah Mada", rank: "Juara 3", desc: "Lomba Transporter" },
    { year: "2019", event: "EBOTEC Nasional - Universitas Gadjah Mada", rank: "Juara 1", desc: "Line Follower Mikro" },
    { year: "2019", event: "EBOTEC Nasional - Universitas Gadjah Mada", rank: "Juara 3", desc: "Line Follower Mikro" },
    { year: "2018", event: "TECHNOWAR Nasional - Universitas Kanjuruhan Malang", rank: "Juara 2", desc: "Line Follower Mikro" },
    { year: "2018", event: "MRC IV Nasional - Universitas Trunojoyo Madura", rank: "Best Design", desc: "Line Follower Mikro" },
    { year: "2018", event: "PLC Competition - Politeknik Negeri Malang", rank: "Juara 1", desc: "PLC Competition" },
    { year: "2018", event: "E-TIME Nasional - Politeknik Negeri Jakarta", rank: "Juara 1", desc: "Line Follower Robot" },
    { year: "2018", event: "E-TIME Nasional - Politeknik Negeri Jakarta", rank: "Juara 2", desc: "Line Follower Robot" },
    { year: "2018", event: "E-TIME Nasional - Politeknik Negeri Jakarta", rank: "Juara 3", desc: "Line Follower Robot" },
    { year: "2017", event: "E-TIME Nasional - Politeknik Negeri Jakarta", rank: "Juara 2", desc: "Line Follower Robot" },
    { year: "2017", event: "IARC Nasional - ITS Surabaya", rank: "Juara 2", desc: "Line Tracer Microcontroller" },
    { year: "2017", event: "EBOTEC Nasional - Universitas Gadjah Mada", rank: "Juara 2", desc: "Line Tracer Microcontroller" },
    { year: "2017", event: "PLC Competition - Politeknik Negeri Malang", rank: "Juara 2", desc: "PLC Competition" },
    { year: "2016", event: "E-TIME Nasional - Politeknik Negeri Jakarta", rank: "Juara 1 & 2", desc: "Line Follower Robot" },
    { year: "2016", event: "LKE Nasional - Politeknik Negeri Malang", rank: "Juara 1", desc: "Line Follower Mikro & Pemadam" },
    { year: "2016", event: "IARC Nasional - ITS Surabaya", rank: "Juara 1 & 3", desc: "Line Tracer Microcontroller" },
    { year: "2016", event: "IARC Nasional - ITS Surabaya", rank: "Juara 1", desc: "Smart Car" },
    { year: "2016", event: "LTDC Nasional - Universitas Negeri Malang", rank: "Juara 1", desc: "Line Follower Mikro" },
    { year: "2016", event: "AITIF Nasional - STMIK Asia Malang", rank: "Juara 2", desc: "Line Follower Mikro" },
    { year: "2016", event: "AITIF Nasional - STMIK Asia Malang", rank: "Juara 3", desc: "Line Follower Mikro" },
    { year: "2015", event: "LKE Nasional - Politeknik Negeri Malang", rank: "Juara 3 & Best Design", desc: "Line Follower Mikro & Pemadam" },
    { year: "2014", event: "KRT Nasional - Univ. Trunojoyo Madura", rank: "Juara 1", desc: "Line Follower Mikro" },
    { year: "2014", event: "Jember Line Tracer", rank: "Juara 3", desc: "Line Follower Mikro" },
    { year: "2014", event: "LTDC Nasional", rank: "Juara 2", desc: "Speed Racer Line Follower" },
    { year: "2014", event: "IARC Nasional - ITS Surabaya", rank: "Juara 1", desc: "Line Follower Mikro" },
    { year: "2013", event: "Android Robotic Contest - Poltek Ujung Pandang", rank: "Juara 1", desc: "Line Follower Microcontroller" },
    { year: "2013", event: "Ellefition - Universitas Diponegoro", rank: "Juara 1", desc: "Line Follower Mikro" },
    { year: "2013", event: "Jember Line Tracer", rank: "Juara 3", desc: "Line Follower Mikro" },
    { year: "2013", event: "LFR Nasional - Politeknik Negeri Jakarta", rank: "Juara 1", desc: "Line Tracer Microcontroller" },
    { year: "2013", event: "IARC Nasional - ITS Surabaya", rank: "Juara 3", desc: "Line Tracer Microcontroller" },
    { year: "2013", event: "Nasional - Politeknik Negeri Sriwijaya", rank: "Juara 3", desc: "Line Tracer Microcontroller" },
    { year: "2012", event: "Apsifest - IT Telkom Bandung", rank: "Juara 1", desc: "Line Tracer Microcontroller" },
    { year: "2012", event: "Jember Line Tracer", rank: "Juara 1", desc: "Line Follower Mikro" },
    { year: "2012", event: "Road Runner Generator - UGM", rank: "Juara 1 & 3", desc: "Line Follower" },
    { year: "2012", event: "Mendikbud Cup - ITS Surabaya", rank: "Juara 1 & 2", desc: "Robot Line Follower Badak" },
    { year: "2011", event: "Training & Competition - ITS Surabaya", rank: "Juara 1 & 2", desc: "Line Tracer Microcontroller" }
];

function renderAchievements() {
    const tableBody = document.getElementById('achievementTableBody');
    tableBody.innerHTML = allAchievements.map(item => `
            <tr>
                <td><span class="badge bg-secondary">${item.year}</span></td>
                <td>
                    <strong>${item.event}</strong><br>
                    <small class="text-muted">${item.desc}</small>
                </td>
                <td><span class="fw-bold text-primary">${item.rank}</span></td>
            </tr>
        `).join('');
}

document.addEventListener('DOMContentLoaded', renderAchievements);
