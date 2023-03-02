
function calculate(options){

    flourAndWaterWeight = calculateFlourAndWater(options.requiredTotalDough, options.totalHydration);
    let levainWeight = calculateLevainWeight(flourAndWaterWeight.flour, options.levainPercentage);
    let flourWithoutLevain = flourAndWaterWeight.flour - levainWeight / 2;
    let waterWithoutLevain = flourAndWaterWeight.water - levainWeight / 2;

    const flours = options.floursPercentage.map(flour => {
        return {
            type: flour.type,
            weight: flourWithoutLevain * flour.percentage / 100,
            percentage: flour.percentage
        }   
    })

    const result = {
        recipeName: options.recipeName,
        totalSize: options.requiredTotalDough,
        totalHydration: options.totalHydration,
        levain: {
            weight: levainWeight,
            percentage: options.levainPercentage,
        },        
        flours: flours,
        salt: {
            weight: flourWithoutLevain * options.saltPercentage / 100,
            percentage: options.saltPercentage
        },
        waterWeight: waterWithoutLevain
    }

    return result;
}

const res = calculate({
    recipeName: 'single pizza',
    requiredTotalDough: 300,
    floursPercentage: [
        {type: 'Tipo 00', percentage: 99.5},
        {type: 'Diastatic malt', percentage: 0.5}
        ],
    levainPercentage: 0,
    totalHydration: 70,
    saltPercentage: 2
})

console.log(res);

function calculateFlourAndWater(requiredTotalDough, totalHydration){
    for(let i = 0; i < requiredTotalDough; i++){
        if(i / (requiredTotalDough - i) >= totalHydration / 100){
            return {water: i, flour: requiredTotalDough - i};        
        }
    }    
}

function calculateLevainWeight(totalFlourWeight, levainPercentage){
    for(let i = 0; i < totalFlourWeight; i++){
        if(i / (totalFlourWeight - i) >= levainPercentage / 100 / 2){
            return i * 2;        
        }
    }    
}