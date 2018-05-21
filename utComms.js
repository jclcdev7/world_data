'use strict';

var ttComms = (liste, template, callback) => {
   var ref = '';
   liste.forEach((item, idx) => {
      if (item.startsWith('Telephones - fixed lines:')) ref = "telfix";
      if (item.startsWith('total:') && ref == "telfix")
         template.comms.tel_fix.total = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('subscriptions per 100 inhabitants:') && ref == "telfix")
         template.comms.tel_fix.sub_per100 = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('country comparison to the world:') && ref == "telfix")
         template.comms.tel_fix.rank = liste[idx+1].split('<')[0].trim();

      if (item.startsWith('Telephones - mobile cellular:'))  ref='telmob';
      if (item.startsWith('total:') && ref == "telmob")
         template.comms.tel_mob.total = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('subscriptions per 100 inhabitants:') && ref == "telmob")
         template.comms.tel_mob.sub_per100 = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('country comparison to the world:') && ref == "telmob")
         template.comms.tel_mob.rank = liste[idx+1].split('<')[0].trim();

      if (item.startsWith('general assessment:')) template.comms.tel_sys.general = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('domestic:')) template.comms.tel_sys.domestic = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('international:')) template.comms.tel_sys.internat = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Broadcast media:')) template.comms.broadcast = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Internet country code:')) template.comms.internet = liste[idx+1].split('<')[0].trim();

      if (item.startsWith('Internet users:')) ref = 'intuser';
      if (item.startsWith('total:') && ref == "intuser")
        template.comms.int_user.total = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('percent of population:') && ref == "intuser")
        template.comms.int_user.percent = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('country comparison to the world:') && ref == "intuser")
        template.comms.int_user.rank = liste[idx+1].split('<')[0].trim();
   });

   callback(template);
}
module.exports.ttComms = ttComms;
