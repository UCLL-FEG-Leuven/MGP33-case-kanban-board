const ctx = document.getElementById('pie-chart');
let chart = null;

// In deze map houden we alle statussen (To do, Doing, Done, ...) bij
// samen met hun overeenkomstige counts. Een Map is dus een soort dictionary.
let statesAndCounts = new Map();

export function updatePieChart(state, count) {    
  
    statesAndCounts.set(state, count);
    console.log(state + ": " + count);
    
    // console.log(Array.from(statesAndCounts.values()));

    // Dit is niet optimaal: het is beter om de chart te behouden en te updaten
    // Maar dat gaat ons momenteel te ver leiden...
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
