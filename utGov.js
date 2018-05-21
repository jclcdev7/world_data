'use strict';

var ttGov = (liste, template, callback) => {
   var ref = '';

   liste.forEach((item, idx) => {
      if (item.startsWith('conventional long form:')) template.government.country_name.conv_long = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('conventional short form:')) template.government.country_name.conv_short = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('local long form:')) template.government.country_name.loc_long = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('local short form:')) template.government.country_name.loc_short = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('former:')) template.government.country_name.former = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('abbreviation:')) template.government.country_name.abbrev = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('etymology:')) template.government.country_name.etymology = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Government type:')) template.government.gov_type = liste[idx+1].split('<')[0].trim();

      if (item.startsWith('Capital:')) ref = 'capital'
      if (item.startsWith('name:') && ref == "capital")
         template.government.capital.name = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('geographic coordinates:') && ref == "capital")
         template.government.capital.coordinates = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('time difference:') && ref == "capital")
         template.government.capital.timezone = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('daylight saving time:') && ref == "capital")
         template.government.capital.daylight = liste[idx+1].split('<')[0].trim();

      if (item.startsWith('Administrative divisions:')) template.government.admin_div = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Independence:')) template.government.independence = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('National holiday:')) template.government.nat_hol = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Constitution:')) {
         template.government.constitution.history = liste[idx+2].split('<')[0].trim();
         template.government.constitution.amdt = liste[idx+4].split('<')[0].trim();
      }
      if (item.startsWith('Legal system:')) template.government.legal = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('International law organization participation:')) template.government.int_law = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('citizenship by birth:')) template.government.citizen.birth = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('citizenship by descent only:')) template.government.citizen.descent = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('dual citizenship recognized:')) template.government.citizen.dual = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('residency requirement for naturalization:')) template.government.citizen.residency = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Suffrage:')) template.government.suffrage = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('chief of state:')) template.government.executive.cos = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('head of government:')) template.government.executive.head_gov = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('cabinet:')) template.government.executive.cabinet = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('elections/appointments:')) template.government.executive.election = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('description:')) template.government.legislative.description = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('elections:')) template.government.legislative.election = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('election results:')) template.government.legislative.result = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('highest court(s):')) template.government.judicial.high_court = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('judge selection and term of office:')) template.government.judicial.judge_sel = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('subordinate courts:')) template.government.judicial.sub_court = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Political parties and leaders:')) {
         var lst = new Array();
         var nb = idx+1;
         while (!liste[nb].startsWith('Political pressure groups and leaders:')  &&
            !liste[nb].startsWith('International organization participation:')  &&
            !liste[nb].startsWith('Flag description:')) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.government.parties = lst;
      }
      if (item.startsWith('Political pressure groups and leaders:')) {
         var lst = new Array();
         var nb = idx+1;
         while (nb < liste.length && !liste[nb].startsWith('International organization participation:')) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.government.pressure = lst;
      }
      if (item.startsWith('International organization participation:')) template.government.int_org = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Flag description:')) template.government.flag = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('National symbol(s):')) template.government.symbol = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('National anthem:')) {
         if (liste[idx+1].startsWith('name:')) {
            template.government.anthem.name = liste[idx+2].split('<')[0].trim();
            template.government.anthem.lyr_mus = liste[idx+4].split('<')[0].trim();
            template.government.anthem.note = liste[idx+6].split('<')[0].trim();
         }
         else
            template.government.anthem.note = liste[idx+2].split('<')[0].trim();
      }
   })

   callback(template);
}
module.exports.ttGov = ttGov;
