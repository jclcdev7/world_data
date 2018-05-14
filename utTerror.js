'use strict';

var ttTerror = (liste, template, callback) => {
   var ref = '';
   liste.forEach((item, idx) => {
      if (item.startsWith('Terrorist groups - home based:')) {
         ref = 'expend';
         var lst = new Array();
         var nb = idx+1;
         while (nb < liste.length && !liste[nb].startsWith('Terrorist groups - foreign based:')) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.terror.home = lst;
      }
      if (item.startsWith('Terrorist groups - foreign based:')) {
         ref = 'expend';
         var lst = new Array();
         var nb = idx+1;
         //while (!liste[nb].startsWith('Show</')) {
         while(nb < liste.length) {
            lst.push(liste[nb].split('<')[0].trim())
            nb+=1
         }
         template.terror.foreign = lst;
      }
   });

   callback(template);
}
module.exports.ttTerror = ttTerror;
