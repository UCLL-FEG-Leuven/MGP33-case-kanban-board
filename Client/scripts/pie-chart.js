import '../node_modules/chart.js/dist/chart.umd.js';

const ctx = document.getElementById('pie-chart');
let chart = null;

// In deze map houden we alle statussen (To do, Doing, Done, ...) bij
// samen met hun overeenkomstige counts. Een Map is een soort dictionary.
let statesAndCounts = new Map();

export function updatePieChart(state, count) {    
  
    statesAndCounts.set(state, count);
    console.log(state + ": " + count);
    
    // console.log(Array.from(statesAndCounts.values()));

    // De chart steeds destroyen en opnieuw aanmaken is niet optiemaal: het is beter om de chart te behouden en te updaten
    // Maar dat gaat ons te ver leiden...
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Array.from(statesAndCounts.keys()),
            datasets: [{
                data: Array.from(statesAndCounts.values()),
            }]
        }
    });
}
