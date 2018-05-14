'use strict';

var ttTransport = (liste, template, callback) => {
   var ref = '';
   //console.log("==> ", template.GEC)
   liste.forEach((item, idx) => {
      if (item.startsWith('number of registered air carriers:')) template.transport.air_trans.carriers = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('inventory of registered aircraft operated by air carriers:')) template.transport.air_trans.aircraft_carriers = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('annual passenger traffic on registered air carriers:')) template.transport.air_trans.passenger = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('annual freight traffic on registered air carriers:')) template.transport.air_trans.freight = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('Civil aircraft registration country code prefix:')) template.transport.country_code = liste[idx+1].split('<')[0].trim();

      // Airports
      if (item.startsWith('Airports:')) {
         template.transport.airports.nb = liste[idx+1].split('<')[0].trim();
         template.transport.airports.rank = liste[idx+3].split('<')[0].trim();
      }

      // Airports - with unpaved runways
      if (item.startsWith('Airports - with paved runways:'))  ref = 'air_pav';
      if (item.startsWith('total') && ref == "air_pav")
         template.transport.airport_paved.total = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('over 3,047 m') && ref == "air_pav")
         template.transport.airport_paved.cl1 = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('2,438 to 3,047 m') && ref == "air_pav")
         template.transport.airport_paved.cl2 = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('1,524 to 2,437 m') && ref == "air_pav")
         template.transport.airport_paved.cl3 = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('914 to 1,523 m') && ref == "air_pav")
         template.transport.airport_paved.cl4 = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('under 914 m') && ref == "air_pav")
         template.transport.airport_paved.cl5 = liste[idx+1].split('<')[0].trim();

      // Airports - with unpaved runways
      if (item.startsWith('Airports - with unpaved runways:')) ref = 'air_unp';
      if (item.startsWith('total') && ref == "air_unp")
         template.transport.airport_unpaved.total = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('over 3,047 m') && ref == "air_unp")
         template.transport.airport_unpaved.cl1 = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('2,438 to 3,047 m') && ref == "air_unp")
         template.transport.airport_unpaved.cl2 = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('1,524 to 2,437 m') && ref == "air_unp")
         template.transport.airport_unpaved.cl3 = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('914 to 1,523 m') && ref == "air_unp")
         template.transport.airport_unpaved.cl4 = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('under 914 m') && ref == "air_unp")
         template.transport.airport_unpaved.cl5 = liste[idx+1].split('<')[0].trim();

      // Heliports
      if (item.startsWith('Heliports:')) template.transport.heliport = liste[idx+1].split('<')[0].trim();

      // Pipelines
      if (item.startsWith('Pipelines:')) template.transport.pipeline = liste[idx+1].split('<')[0].trim();

      // Railways
      if (item.startsWith('Railways:'))  ref = "railways";
      if (item.startsWith('total') && ref == "railways")
         template.transport.railways.total = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('broad') && ref == "railways")
         template.transport.railways.broad = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('standard') && ref == "railways")
         template.transport.railways.standard = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('narrow') && ref == "railways")
         template.transport.railways.narrow = liste[idx+1].split('<')[0].trim();
         if (item.startsWith('dual') && ref == "railways")
            template.transport.railways.dual = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('country comparison to the world') && ref == "railways")
         template.transport.railways.rank = liste[idx+1].split('<')[0].trim();


      // Roadways
      if (item.startsWith('Roadways:')) ref = "roadways";
      if (item.startsWith('total') && ref == "roadways")
         template.transport.roadways.total = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('paved') && ref == "roadways")
         template.transport.roadways.paved = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('unpaved') && ref == "roadways")
         template.transport.roadways.unpaved = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('country comparison to the world') && ref == "roadways")
         template.transport.roadways.rank = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('note') && ref == "roadways")
         template.transport.roadways.note = liste[idx+1].split('<')[0].trim();

      // Waterways:
      if (item.startsWith('Waterways:')) {
         ref = "waterway";
         var txt = '';
         txt = liste[idx+1].split('<')[0].trim();
         if (txt.endsWith(':')) txt+= ' '+liste[idx+2].split('<')[0].trim();
         template.transport.waterways.total = txt;
      }
      if (item.startsWith('country comparison to the world') && ref == "waterway")
         template.transport.waterways.rank = liste[idx+1].split('<')[0].trim();

      // Merchant marine:
      if (item.startsWith('Merchant marine:'))  ref = "merchMar";
      if (item.startsWith('total') && ref == "merchMar")
         template.transport.merch_marine.total = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('by type') && ref == "merchMar")
         template.transport.merch_marine.type = liste[idx+1].split('<')[0].trim();
      if (item.startsWith('foreign-owned') && ref == "merchMar")
         console.log("Transport - foreign-owned (not done) ==> ", template.GEC)
      if (item.startsWith('registered') && ref == "merchMar")
         console.log("Transport - registered (not done) ==> ", template.GEC)
      if (item.startsWith('country comparison to the world') && ref == "merchMar")
         template.transport.merch_marine.rank = liste[idx+1].split('<')[0].trim();

      // Ports and terminals:
      if (item.startsWith('major seaport(s):'))  {
         template.transport.ports.seaport = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('river ') && item.indexOf('port(s)') != -1)  {
         template.transport.ports.river_lake = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('oil terminal(s):'))  {
         template.transport.ports.oil_term = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('dry bulk cargo port(s):'))  {
         template.transport.ports.dry_bulk = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('container port(s)'))  {
         template.transport.ports.container = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('LNG terminal(s)'))  {
         template.transport.ports.lng = liste[idx+1].split('<')[0].trim();
      }
      if (item.startsWith('cruise/ferry port(s)'))  {
         template.transport.ports.ferry = liste[idx+1].split('<')[0].trim();
      }

      // Transportation - note:
      if (item.startsWith('Transportation - note:'))  {
         template.transport.notes = liste[idx+1].split('<')[0].trim();
      }
   });

   callback(template);
}
module.exports.ttTransport = ttTransport;
