// Using requirejs
require(['./Chart.js'], function(Chart){
    var Chartjs = Chart.noConflict();
});

var Attack = function(prof, abilityMod, atkMod, dmgMod, die){
    this.prof = prof || 1;
    this.abilityMod = abilityMod || 0;
    this.atkMod = atkMod || 0;
    this.dmgMod = dmgMod || 0;
    this.die = die || 1;
    
    this.expectedDamageWithoutFumble =  function (ac, chances){
        var iterations = iterations || 1;
    
        var attack = this.prof + this.abilityMod + this.atkMod;          
 
        var chance = chances || {
            hit: (19 - (ac - attack) + 1) / 20,
            crit: 0.05
        }
        
        var damage = {
            hit: (((die / 2) + 0.5) + abilityMod + dmgMod),
            crit: (die + abilityMod + dmgMod)
        }
        
        var ret = (chance['hit'] * damage['hit']) + (chance['crit'] * damage['crit']);
        
        return ret;
    };
} 

var expectedDamageByRound = function(attacks, ac, round){
	if(Array.isArray && !Array.isArray(attacks) || round < 1){
		return 'bad input';
	}
	
	var chancesOfNoFumble =  Array.apply(null, new Array(attacks.length)).map(Number.prototype.valueOf,0);
	chancesOfNoFumble[0] = Math.pow(0.95, round-1);
	for(var i = 1; i < chancesOfNoFumble.length && i < round; i++){
		chancesOfNoFumble[i] = 1 - chancesOfNoFumble.slice(0, round).reduce(function(a, b) { return a + b; });
	}
	
	var ret = 0;
	for(var a in attacks){
		var chance = chancesOfNoFumble[a];
		var attack = attacks[a];
		var damage = attack.expectedDamageWithoutFumble(ac);
		var expectedDamage = (chance * damage);
        
        if(round % 2 === 0 && a !== attacks.length - 1){
            expectedDamage *= 0.95;
        }
        
		ret += expectedDamage;
	}
	
	return ret;
};

document.getElementById("mainProficiency").value = 3;
document.getElementById("mainAbilityMod").value = 4;
document.getElementById("mainAttackMod").value = 1;
document.getElementById("mainDamageMod").value = 1;
document.getElementById("mainDieSize").value = 8;
document.getElementById("sideProficiency").value = 3;
document.getElementById("sideAbilityMod").value = 1;
document.getElementById("sideAttackMod").value = 0;
document.getElementById("sideDamageMod").value = 0;
document.getElementById("sideDieSize").value = 8;
document.getElementById("armorClass").value = 15;
document.getElementById("attacks").value = 8;

var mainAttack = new Attack(
            document.getElementById("mainProficiency").value - 0,
            document.getElementById("mainAbilityMod").value - 0,
            document.getElementById("mainAttackMod").value - 0,
            document.getElementById("mainDamageMod").value - 0,
            document.getElementById("mainDieSize").value - 0
        );
    
    var sideArmAttack = new Attack(
            document.getElementById("sideProficiency").value - 0,
            document.getElementById("sideAbilityMod").value - 0,
            document.getElementById("sideAttackMod").value - 0,
            document.getElementById("sideDamageMod").value - 0,
            document.getElementById("sideDieSize").value - 0
        );
    
    var enteredUnarmed = new Attack(
            document.getElementById("mainProficiency").value - 0, 
            document.getElementById("mainAbilityMod").value - 0, 0, 0, 1);
    
    
    var ac = document.getElementById("armorClass").value;
    var attackCount = document.getElementById("attacks").value;
    
    var attacks = [mainAttack, sideArmAttack, enteredUnarmed];
    var chartable = [];
    for(var round = 1; round <= attackCount; round++){
        chartable[round-1] = expectedDamageByRound(attacks, ac, round);
    }
    
    var mainExpected = mainAttack.expectedDamageWithoutFumble(ac);

    var chartable2 = Array.apply(null, new Array(chartable.length)).map(Number.prototype.valueOf, mainExpected);

    var diff = [];
    for(var i = 0; i < chartable.length; i++){
        diff[i] = ((chartable2[i] - chartable[i]) / chartable2[i] * 100);
    }

    var labels = [];
    for(var i = 1; i <= attackCount; i++){
        labels[i-1] = i+'';
    }
    
    var mainCtx = document.getElementById("compareChart").getContext("2d");
    
    var data = {
        labels: labels,
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,0,0,0.2)",
                strokeColor: "rgba(220,0,0,1)",
                pointColor: "rgba(220,0,0,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: chartable
            }, {
                label: "My Second dataset",
                fillColor: "rgba(0,0,220,0.2)",
                strokeColor: "rgba(0,0,220,1)",
                pointColor: "rgba(0,0,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: chartable2
            }
        ]
    };
    var lineChart = new Chart(mainCtx).Line(data, {animation: false, bezierCurve: false});

    /*
    var sideCtx = document.getElementById("diffChart").getContext("2d");
    var data = {
        labels: labels,
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(0,220,0,0.2)",
                strokeColor: "rgba(0,220,0,1)",
                pointColor: "rgba(0,220,0,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: diff
            }
        ]
    };
    var diffChart = new Chart(sideCtx).Line(data, {});
    */

var calculate = function(){
    var mainAttack = new Attack(
            document.getElementById("mainProficiency").value - 0,
            document.getElementById("mainAbilityMod").value - 0,
            document.getElementById("mainAttackMod").value - 0,
            document.getElementById("mainDamageMod").value - 0,
            document.getElementById("mainDieSize").value - 0
        );
    
    var sideArmAttack = new Attack(
            document.getElementById("sideProficiency").value - 0,
            document.getElementById("sideAbilityMod").value - 0,
            document.getElementById("sideAttackMod").value - 0,
            document.getElementById("sideDamageMod").value - 0,
            document.getElementById("sideDieSize").value - 0
        );
    
    var enteredUnarmed = new Attack(
            document.getElementById("mainProficiency").value - 0, 
            document.getElementById("mainAbilityMod").value - 0, 0, 0, 1);
    
    
    var ac = document.getElementById("armorClass").value;
    var attackCount = document.getElementById("attacks").value;
    
    var attacks = [mainAttack, sideArmAttack, enteredUnarmed];
    var chartable = [];
    for(var round = 1; round <= attackCount; round++){
        chartable[round-1] = expectedDamageByRound(attacks, ac, round);
    }
    
    var mainExpected = mainAttack.expectedDamageWithoutFumble(ac);

    var chartable2 = Array.apply(null, new Array(chartable.length)).map(Number.prototype.valueOf, mainExpected);

    var diff = [];
    for(var i = 0; i < chartable.length; i++){
        diff[i] = ((chartable2[i] - chartable[i]) / chartable2[i] * 100);
    }

    var labels = [];
    for(var i = 1; i <= attackCount; i++){
        labels[i-1] = i+'';
    }
    
    for(var i = 0; i < attackCount; i++){
        if(i < lineChart.datasets[0].points.length){
            lineChart.datasets[0].points[i].value = chartable[i];
            lineChart.datasets[1].points[i].value = chartable2[i];
        } else {
            lineChart.addData([chartable[i], chartable2[i]], ((i+1)+''));
        }
    }
    lineChart.update();
}
