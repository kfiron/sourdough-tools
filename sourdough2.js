
function calculate(options){

    flourAndWaterWeight = calculateFlourAndWater(options.requiredTotalDough, options.totalHydration, options.splitWater);
    let levainWeight = calculateLevainWeight(flourAndWaterWeight.flour, options.levainPercentage);
    let flourWithoutLevain = flourAndWaterWeight.flour - levainWeight / 2;
    let waterWithoutLevain = flourAndWaterWeight.water - levainWeight / 2;
    
    let water;

    if(options.splitWater){
      let water1 = waterWithoutLevain * ((100-options.splitWater) / 100)
      let water2 = waterWithoutLevain - water1;
      water = { water1: Math.round(water1), water2: Math.round(water2)}
    } else {
        water = { water: waterWithoutLevain}
    }

    let yeast;

    if(options.yeast){
        yeast = flourAndWaterWeight.flour * (options.yeast / 100)        
    }

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
        water: water, 
        yeast: yeast
    }

    return result;
}

const res = calculate({
    recipeName: 'Hybrid Neopolitan Pizza',
    requiredTotalDough: 1700,
    floursPercentage: [
        {type: 'Caputo Tipo 00', percentage: 100}        
        ],
    levainPercentage: 10,
    totalHydration: 70,
    saltPercentage: 2.5,
    splitWater: 4,
    yeast: 0.1
})

console.log (res);

function calculateFlourAndWater(requiredTotalDough, totalHydration, splitWater){
    
    let foundWater = false;
    let water1 = 0;

    for(let i = 0; i < requiredTotalDough; i++){
        
        if(i / (requiredTotalDough - i) >= splitWater / 100 && !foundWater && splitWater){
            water1 = i; 
            foundWater = true;
        }
        if(i / (requiredTotalDough - i) >= totalHydration / 100){
            return {water: i, flour: requiredTotalDough - i, water1: water1};        
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