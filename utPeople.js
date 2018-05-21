'use strict';

var ttPeople = (liste, template, callback) => {
  var ref = '';
  var refb = '';
  liste.forEach((item, idx) => {
      if (item.startsWith('Population:')) {
        ref = 'pop';
        template.peop_soc.population.total = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('country comparison to the world:') && ref == 'pop')
         template.peop_soc.population.rank = liste[idx+1].split('<')[0].trim();

      if (item.startsWith('Nationality:')) ref = 'nation';
      if (item.startsWith('noun') && ref=='nation')
        template.peop_soc.nationality.noun = liste[idx+2].split('<')[0].trim();
      if (item.startsWith('adjective') && ref=='nation')
          template.peop_soc.nationality.adjective = liste[idx+1].split('<')[0].trim();

     if (item.startsWith('Ethnic groups:')) template.peop_soc.ethnic.group = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('Languages:')) template.peop_soc.language.lg = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('Religions:')) template.peop_soc.religion = liste[idx+1].split('<')[0].trim();

     // age structure
     /*if (item.startsWith('Age structure:')) ref = 'age_struct';
     if (item.startsWith('0-14 years:') && ref == 'age_struct') {
        var age = {};
        age["age"] = liste[idx].split('<')[0].trim()
        age["note"] = liste[idx+1].split('<')[0].trim()
        template.peop_soc.age.push(age);
     }
     if (item.startsWith('15-24 years:') && ref == 'age_struct') {
        var age = {};
        age["age"] = liste[idx].split('<')[0].trim()
        age["note"] = liste[idx+1].split('<')[0].trim()
        template.peop_soc.age.push(age);
     }
     if (item.startsWith('25-54 years:') && ref == 'age_struct') {
        var age = {};
        age["age"] = liste[idx].split('<')[0].trim()
        age["note"] = liste[idx+1].split('<')[0].trim()
        template.peop_soc.age.push(age);
     }
     if (item.startsWith('55-64 years:') && ref == 'age_struct') {
        var age = {};
        age["age"] = liste[idx].split('<')[0].trim()
        age["note"] = liste[idx+1].split('<')[0].trim()
        template.peop_soc.age.push(age);
     }
     if (item.startsWith('65 years and over:') && ref == 'age_struct') {
        var age = {};
        age["age"] = liste[idx].split('<')[0].trim()
        age["note"] = liste[idx+1].split('<')[0].trim()
        template.peop_soc.age.push(age);
        ref = '';
     }*/

     if (item.startsWith('Age structure:')) ref = 'age_struct';
     if (item.startsWith('0-14 years') && ref == 'age_struct')
        template.peop_soc.age.a14 = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('15-24 years') && ref == 'age_struct')
        template.peop_soc.age.a24 = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('25-54 years') && ref == 'age_struct')
        template.peop_soc.age.a54 = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('55-64 years') && ref == 'age_struct')
        template.peop_soc.age.a64 = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('65 years and over') && ref == 'age_struct')
        template.peop_soc.age.over = liste[idx+1].split('<')[0].trim();


     if (item.startsWith('total dependency ratio:')) template.peop_soc.dependency.total = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('youth dependency ratio:')) template.peop_soc.dependency.youth = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('elderly dependency ratio:')) template.peop_soc.dependency.elderly = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('potential support ratio:')) template.peop_soc.dependency.support = liste[idx+1].split('<')[0].trim();

     if (item.startsWith('Median age:')) ref = 'median';
     if (item.startsWith('total') && ref == 'median')
        template.peop_soc.median.total = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('male') && ref == 'median')
        template.peop_soc.median.male = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('female') && ref == 'median')
        template.peop_soc.median.female = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('country comparison to the world') && ref == 'median')
        template.peop_soc.median.rank = liste[idx+1].split('<')[0].trim();

     if (item.startsWith('Population growth rate:')) {
       ref = 'growth';
       template.peop_soc.growth.rate = liste[idx+1].split('<')[0].trim();
     }
     if (item.startsWith('country comparison to the world') && ref == 'median')
        template.peop_soc.growth.rank = liste[idx+1].split('<')[0].trim();

     // birth rate
     if (item.startsWith('Birth rate:'))
     {
        ref = 'birth';
        template.peop_soc.birth.rate = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('country comparison to the world') && ref == 'birth')
        template.peop_soc.birth.rank = liste[idx+1].split('<')[0].trim();

      // death rate
     if (item.startsWith('Death rate:'))
     {
        ref = 'death';
        template.peop_soc.death.rate = liste[idx+1].split('<')[0].trim();
     }
     if (item.startsWith('country comparison to the world') && ref == 'death')
        template.peop_soc.death.rank = liste[idx+1].split('<')[0].trim();

     // Net migration rate
     if (item.startsWith('Net migration rate:'))
     {
       ref = 'migrat_rate';
       template.peop_soc.migration.rate = liste[idx+1].split('<')[0].trim();
     }
     if (item.startsWith('country comparison to the world') && ref == 'migrat_rate')
        template.peop_soc.migration.rank = liste[idx+1].split('<')[0].trim();

     if (item.startsWith('Population distribution:')) template.peop_soc.distribution = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('urban population:')) template.peop_soc.urbanization.urban = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('rate of urbanization:')) template.peop_soc.urbanization.rate = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('Major urban areas - population:')) template.peop_soc.urban_areas = liste[idx+1].split('<')[0].trim();

     // Sex ratio
     /*if (item.startsWith('Sex ratio:')) ref = 'sex_ratio';
     if (item.startsWith('at birth:') && ref == 'sex_ratio') {
        var age = {};
        age["age"] = liste[idx].split('<')[0].trim()
        age["note"] = liste[idx+1].split('<')[0].trim()
        template.peop_soc.sex.push(age);
     }
     if (item.startsWith('0-14 years:') && ref == 'sex_ratio') {
        var age = {};
        age["age"] = liste[idx].split('<')[0].trim()
        age["note"] = liste[idx+1].split('<')[0].trim()
        template.peop_soc.sex.push(age);
     }
     if (item.startsWith('15-24 years:') && ref == 'sex_ratio') {
        var age = {};
        age["age"] = liste[idx].split('<')[0].trim()
        age["note"] = liste[idx+1].split('<')[0].trim()
        template.peop_soc.sex.push(age);
     }
     if (item.startsWith('25-54 years:') && ref == 'sex_ratio') {
        var age = {};
        age["age"] = liste[idx].split('<')[0].trim()
        age["note"] = liste[idx+1].split('<')[0].trim()
        template.peop_soc.sex.push(age);
     }
     if (item.startsWith('55-64 years:') && ref == 'sex_ratio') {
        var age = {};
        age["age"] = liste[idx].split('<')[0].trim()
        age["note"] = liste[idx+1].split('<')[0].trim()
        template.peop_soc.sex.push(age);
     }
     if (item.startsWith('65 years and over:') && ref == 'sex_ratio') {
        var age = {};
        age["age"] = liste[idx].split('<')[0].trim()
        age["note"] = liste[idx+1].split('<')[0].trim()
        template.peop_soc.sex.push(age);
     }
     if (item.startsWith('total population:') && ref == 'sex_ratio') {
        var age = {};
        age["age"] = liste[idx].split('<')[0].trim()
        age["note"] = liste[idx+1].split('<')[0].trim()
        template.peop_soc.sex.push(age);
        ref = '';
     }*/

     if (item.startsWith('Sex ratio:')) ref = 'sex_ratio';
     if (item.startsWith('at birth:') && ref == 'sex_ratio')
        template.peop_soc.sex.birth = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('0-14 years') && ref == 'sex_ratio')
        template.peop_soc.sex.a14 = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('15-24 years') && ref == 'sex_ratio')
        template.peop_soc.sex.a24 = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('25-54 years') && ref == 'sex_ratio')
        template.peop_soc.sex.a54 = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('55-64 years') && ref == 'sex_ratio')
        template.peop_soc.sex.a64 = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('65 years and over') && ref == 'sex_ratio')
        template.peop_soc.sex.over = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('total population:') && ref == 'sex_ratio')
        template.peop_soc.sex.total = liste[idx+1].split('<')[0].trim();

     if (item.startsWith("Mother's mean age at first birth:")) template.peop_soc.mother_first_birth = liste[idx+1].split('<')[0].trim();

     // Maternal mortality ratio
     if (item.startsWith("Maternal mortality ratio:")) {
        ref = 'mat_mort';
        template.peop_soc.mother_death.rate = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('country comparison to the world') && ref == 'mat_mort')
        template.peop_soc.mother_death.rank = liste[idx+1].split('<')[0].trim();

     // Infant mortality rate
     if (item.startsWith("Infant mortality rate:")) ref = 'infant_mort';
     if (item.startsWith("total") && ref == 'infant_mort')
        template.peop_soc.infant_death.total = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("male") && ref == 'infant_mort')
        template.peop_soc.infant_death.male = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("female") && ref == 'infant_mort')
        template.peop_soc.infant_death.female = liste[idx+1].split('<')[0].trim();
     if (item.startsWith('country comparison to the world') && ref == 'infant_mort')
        template.peop_soc.infant_death.rank = liste[idx+1].split('<')[0].trim();

     // Life expectancy at birth
     if (item.startsWith("Life expectancy at birth:")) ref = 'life_expect';
     if (item.startsWith("total population") && ref == 'life_expect')
        template.peop_soc.life_birth.total = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("male") && ref == 'life_expect')
        template.peop_soc.life_birth.male = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("female") && ref == 'life_expect')
        template.peop_soc.life_birth.female = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("country comparison to the world") && ref == 'life_expect')
        template.peop_soc.life_birth.rank = liste[idx+1].split('<')[0].trim();

     // Total fertility rate
     if (item.startsWith("Total fertility rate:")) {
        ref = 'fertile';
        template.peop_soc.fertility.rate = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith("country comparison to the world") && ref=='fertile')
        template.peop_soc.fertility.rank = liste[idx+1].split('<')[0].trim();

     if (item.startsWith("Contraceptive prevalence rate:")) template.peop_soc.contraceptive = liste[idx+1].split('<')[0].trim();

     // Health expenditures
     if (item.startsWith("Health expenditures:")) {
        ref = 'hexpend'
        template.peop_soc.health_exp.rate = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith("country comparison to the world") && ref=='hexpend')
        template.peop_soc.health_exp.rank = liste[idx+1].split('<')[0].trim();


     if (item.startsWith("Physicians density:")) template.peop_soc.physicians = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("Hospital bed density:")) template.peop_soc.hospital = liste[idx+1].split('<')[0].trim();

     // Drinking water source
     if (item.startsWith("Drinking water source:")) ref ='drink';

     if (item.startsWith("improved") && ref == 'drink') refb = 'imp';
     if (item.startsWith("urban") && ref == 'drink' && refb == 'imp')
        template.peop_soc.drink_water.imp.urban = liste[idx].split('<')[0].split(': ')[1].trim();
     if (item.startsWith("rural") && ref == 'drink' && refb == 'imp')
        template.peop_soc.drink_water.imp.rural = liste[idx].split('<')[0].split(': ')[1].trim();
     if (item.startsWith("total") && ref == 'drink' && refb == 'imp') {
        template.peop_soc.drink_water.imp.total = liste[idx].split('<')[0].split(': ')[1].trim();
        refb = '';
      }

     if (item.startsWith("unimproved") && ref == 'drink') refb = 'unimp';
     if (item.startsWith("urban") && ref == 'drink' && refb == 'unimp')
        template.peop_soc.drink_water.unimp.urban = liste[idx].split('<')[0].split(': ')[1].trim();
     if (item.startsWith("rural") && ref == 'drink' && refb == 'unimp')
        template.peop_soc.drink_water.unimp.rural = liste[idx].split('<')[0].split(': ')[1].trim();
     if (item.startsWith("total") && ref == 'drink' && refb == 'unimp') {
        template.peop_soc.drink_water.unimp.total = liste[idx].split('<')[0].split(': ')[1].trim();
        refb='';
        ref = '';
      }
     /*if (item.startsWith("Drinking water source:")) {
        var nb = idx+2;
        template.peop_soc.drink_water.imp.urban = liste[idx+2].split('<')[0].split(': ')[1].trim();
        nb+=1
        if (liste[nb].startsWith('rural:')) {
           template.peop_soc.drink_water.imp.rural = liste[nb].split('<')[0].split(': ')[1].trim();
           nb+=1
        }
        if (liste[nb].startsWith('total:')) {
           template.peop_soc.drink_water.imp.total = liste[nb].split('<')[0].split(': ')[1].trim();
           nb+=1;
        }
        nb+=1
        template.peop_soc.drink_water.unimp.urban = liste[nb].split('<')[0].split(': ')[1].trim();
        nb+=1
        if (liste[nb].startsWith('rural:')) {
           template.peop_soc.drink_water.unimp.rural = liste[nb].split('<')[0].split(': ')[1].trim();
           nb+=1
        }
        if (liste[nb].startsWith('total:'))
           template.peop_soc.drink_water.unimp.total = liste[nb].split('<')[0].split(': ')[1].trim();
     }*/

     // Sanitation facility access
     if (item.startsWith("Sanitation facility access:")) ref ='sanit';

     if (item.startsWith("improved") && ref == 'sanit') refb = 'imp';
     if (item.startsWith("urban") && ref == 'sanit' && refb == 'imp')
        template.peop_soc.sanitation.imp.urban = liste[idx].split('<')[0].split(': ')[1].trim();
     if (item.startsWith("rural") && ref == 'sanit' && refb == 'imp')
        template.peop_soc.sanitation.imp.rural = liste[idx].split('<')[0].split(': ')[1].trim();
     if (item.startsWith("total") && ref == 'sanit' && refb == 'imp') {
        template.peop_soc.sanitation.imp.total = liste[idx].split('<')[0].split(': ')[1].trim();
        refb = '';
      }

     if (item.startsWith("unimproved") && ref == 'sanit') refb = 'unimp';
     if (item.startsWith("urban") && ref == 'sanit' && refb == 'unimp')
        template.peop_soc.sanitation.unimp.urban = liste[idx].split('<')[0].split(': ')[1].trim();
     if (item.startsWith("rural") && ref == 'sanit' && refb == 'unimp')
        template.peop_soc.sanitation.unimp.rural = liste[idx].split('<')[0].split(': ')[1].trim();
     if (item.startsWith("total") && ref == 'sanit' && refb == 'unimp') {
        template.peop_soc.sanitation.unimp.total = liste[idx].split('<')[0].split(': ')[1].trim();
        refb = '';
        ref = '';
      }

     /*if (item.startsWith("Sanitation facility access:")) {
        template.peop_soc.sanitation.imp.urban = liste[idx+2].split('<')[0].split(': ')[1].trim();
        template.peop_soc.sanitation.imp.rural = liste[idx+3].split('<')[0].split(': ')[1].trim();
        template.peop_soc.sanitation.imp.total = liste[idx+4].split('<')[0].split(': ')[1].trim();
        template.peop_soc.sanitation.unimp.urban = liste[idx+6].split('<')[0].split(': ')[1].trim();
        if (liste[idx+7].indexOf(': ') != -1)
           template.peop_soc.sanitation.unimp.rural = liste[idx+7].split('<')[0].split(': ')[1].trim();
        else
           template.peop_soc.sanitation.unimp.rural = liste[idx+7].split('<')[0].trim();
        if (liste[idx+8].indexOf(': ') != -1)
           template.peop_soc.sanitation.unimp.total = liste[idx+8].split('<')[0].split(': ')[1].trim();
        else
           template.peop_soc.sanitation.unimp.total = liste[idx+8].split('<')[0].trim();
     }*/

     // HIV/AIDS - adult prevalence rate
     if (item.startsWith("HIV/AIDS - adult prevalence rate:")) {
        template.peop_soc.hiv_prevalence.rate = liste[idx+1].split('<')[0].trim();
        ref = 'hiv_preval';
     }
     if (item.startsWith("country comparison to the world") && ref == 'hiv_preval')
        template.peop_soc.hiv_prevalence.rank = liste[idx+1].split('<')[0].trim();

     // HIV/AIDS - people living with HIV/AIDS
     if (item.startsWith("HIV/AIDS - people living with HIV/AIDS:")) {
        template.peop_soc.hiv_living.rate = liste[idx+1].split('<')[0].trim();
        ref = 'hiv_living'
     }
     if (item.startsWith("country comparison to the world") && ref == 'hiv_living')
        template.peop_soc.hiv_living.rank = liste[idx+1].split('<')[0].trim();


     if (item.startsWith("HIV/AIDS - deaths:")) template.peop_soc.hiv_death = liste[idx+1].split('<')[0].trim(); // bug with value of type <500 for instance

     // Major infectious diseases
     if (item.startsWith("degree of risk")) template.peop_soc.infect.risk = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("food or waterborne disease")) template.peop_soc.infect.food = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("vectorborne disease")) template.peop_soc.infect.vector = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("water contact disease")) template.peop_soc.infect.water = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("aerosolized dust or soil contact")) template.peop_soc.infect.dust = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("respiratory disease")) template.peop_soc.infect.resp = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("animal contact disease")) template.peop_soc.infect.animal = liste[idx+1].split('<')[0].trim();

     // Obesity - adult prevalence rate
     if (item.startsWith("Obesity - adult prevalence rate:")) {
        ref = 'obesity';
        template.peop_soc.obesity.rate = liste[idx+1].split('<')[0].trim();
     }
     if (item.startsWith("country comparison to the world") && ref == 'obesity')
        template.peop_soc.obesity.rank = liste[idx+1].split('<')[0].trim();

     // Children under the age of 5 years underweight
     if (item.startsWith("Children under the age of 5 years underweight:")) {
        template.peop_soc.underweight.rate = liste[idx+1].split('<')[0].trim();
        ref = 'underweight';
     }
     if (item.startsWith("country comparison to the world") && ref == 'underweight')
        template.peop_soc.underweight.rank = liste[idx+1].split('<')[0].trim();

     // Education expenditures
     if (item.startsWith("Education expenditures:")) {
        template.peop_soc.educ_exp.rate = liste[idx+1].split('<')[0].trim();
        ref = 'educ_exp';
     }
     if (item.startsWith("country comparison to the world") && ref == 'educ_exp')
         template.peop_soc.educ_exp.rank = liste[idx+1].split('<')[0].trim();
     /*if (item.startsWith("Education expenditures:")) {
        if (!liste[idx+1].startsWith('NA')) {
           template.peop_soc.educ_exp.rate = liste[idx+1].split('<')[0].trim();
           if (liste[idx+2] != undefined && liste[idx+2].startsWith('country comparison to the world:'))
              template.peop_soc.educ_exp.rank = liste[idx+3].split('<')[0].trim();
        }
     }*/

     // literacy
     if (item.startsWith("Literacy:")) ref = 'literacy';
     if (item.startsWith("definition") && ref == 'literacy')
         template.peop_soc.literacy.def = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("total population") && ref == 'literacy')
         template.peop_soc.literacy.total = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("male") && ref == 'literacy')
         template.peop_soc.literacy.male = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("female") && ref == 'literacy')
         template.peop_soc.literacy.female = liste[idx+1].split('<')[0].trim();

     // school life expectancy
     if (item.startsWith("School life expectancy (primary to tertiary education):"))  ref = 'school';
      if (item.startsWith("total") && ref=='school')
        template.peop_soc.school.total = liste[idx+1].split('<')[0].trim();
      if (item.startsWith("male") && ref=='school')
        template.peop_soc.school.male = liste[idx+1].split('<')[0].trim();
      if (item.startsWith("female") && ref=='school')
        template.peop_soc.school.female = liste[idx+1].split('<')[0].trim();


     if (item.startsWith("Child labor")) console.log("child labor ", template.GEC) // no impact until now

     // Unemployment, youth ages 15-24
     if (item.startsWith("Unemployment, youth ages 15-24:")) ref = 'unemploy';
     if (item.startsWith("total") && ref== 'unemploy')
        template.peop_soc.unemploy.total = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("male") && ref== 'unemploy')
        template.peop_soc.unemploy.male = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("female") && ref== 'unemploy')
        template.peop_soc.unemploy.female = liste[idx+1].split('<')[0].trim();
     if (item.startsWith("country comparison to the world") && ref== 'unemploy')
        template.peop_soc.unemploy.rank = liste[idx+1].split('<')[0].trim();


     if (item.startsWith("People - note"))
        template.peop_soc.people_note = liste[idx+1].split('<')[0].trim();
  })

  callback(template);
}
module.exports.ttPeople = ttPeople;
