
function calculate(options){

    let flourAndWaterWeight = calculateFlourAndWater(options.requiredTotalDough, options.totalHydration, options.splitWater);
    let levainWeight = calculateLevainWeight(flourAndWaterWeight.flour, options.levainPercentage);
    let flourWithoutLevain = Math.round(flourAndWaterWeight.flour - levainWeight * flourByLevainType(options.levainHydration));
    let waterWithoutLevain = Math.round(flourAndWaterWeight.water - levainWeight * waterByLevainType(options.levainHydration));
    
    let water;

    if(options.splitWater){
      let water1 = waterWithoutLevain * ((100-options.splitWater) / 100)
      let water2 = waterWithoutLevain - water1;
      water = { water1: Math.round(water1), 
                water2: Math.round(water2),
                splitBy: options.splitWater.toString() + '%'}
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
            levainHydration: options.levainHydration
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
    recipeName: 'pizza stiff sourdough',
    requiredTotalDough: 800,
    floursPercentage: [
        {type: 'nuvola', percentage: 100}       
        ],
    levainPercentage: 20,
    levainHydration: 'stiff', /* stiff / normal */
    totalHydration: 70,
    saltPercentage: 2,
    splitWater: false ,
    //yeast: false
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

function flourByLevainType(lType){
    switch(lType){
        case 'stiff':
            return 2 / 3;
        break;
        case 'normal':
            return 1 / 2;
        break;
    }
}


function waterByLevainType(lType){
    switch(lType){
        case 'stiff':
            return 1 / 3;
        break;
        case 'normal':
            return 1 / 2;
        break;
    }
}
