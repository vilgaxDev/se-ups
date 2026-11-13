export interface CountyData {
  name: string;
  subCounties: string[];
}

export const KENYA_COUNTIES: CountyData[] = [
  {
    name: 'Nairobi',
    subCounties: [
      'Westlands',
      'Nairobi Central (CBD)',
      'Kilimani & Kileleshwa',
      'Dagoretti North',
      'Dagoretti South',
      'Langata & Karen',
      'Kibra',
      'Roysambu',
      'Kasarani',
      'Ruaraka',
      'Embakasi North',
      'Embakasi South',
      'Embakasi Central',
      'Embakasi East',
      'Embakasi West',
      'Makadara',
      'Kamukunji',
      'Starehe'
    ]
  },
  {
    name: 'Mombasa',
    subCounties: [
      'Mvita (Island/CBD)',
      'Nyali',
      'Kisauni',
      'Likoni',
      'Changamwe',
      'Jomvu'
    ]
  },
  {
    name: 'Kisumu',
    subCounties: [
      'Kisumu Central',
      'Kisumu East',
      'Kisumu West',
      'Seme',
      'Nyando',
      'Muhoroni',
      'Nyakach'
    ]
  },
  {
    name: 'Nakuru',
    subCounties: [
      'Nakuru Town East',
      'Nakuru Town West',
      'Naivasha',
      'Gilgil',
      'Molo',
      'Njoro',
      'Rongai',
      'Subukia',
      'Kuresoi North',
      'Kuresoi South',
      'Bahati'
    ]
  },
  {
    name: 'Kiambu',
    subCounties: [
      'Thika Town',
      'Ruiru',
      'Kiambu Town',
      'Kikuyu',
      'Kabete',
      'Limuru',
      'Juja',
      'Githunguri',
      'Lari'
    ]
  },
  {
    name: 'Uasin Gishu',
    subCounties: [
      'Eldoret CBD / Ainabkoi',
      'Kapseret',
      'Kesses',
      'Moiben',
      'Soy',
      'Turbo'
    ]
  },
  {
    name: 'Machakos',
    subCounties: [
      'Machakos Town',
      'Mavoko (Athi River / Syokimau)',
      'Kangundo',
      'Matungulu',
      'Mwala',
      'Yatta'
    ]
  },
  {
    name: 'Kajiado',
    subCounties: [
      'Kajiado North (Ngong/Rongai)',
      'Kajiado East (Kitengela)',
      'Kajiado Central',
      'Kajiado West',
      'Kajiado South'
    ]
  },
  {
    name: 'Meru',
    subCounties: [
      'Imenti North (Meru Town)',
      'Imenti South',
      'Imenti Central',
      'Buuri',
      'Tigania West',
      'Tigania East',
      'Igembe South'
    ]
  },
  {
    name: 'Kakamega',
    subCounties: [
      'Lurambi (Kakamega Town)',
      'Malava',
      'Shinyalu',
      'Ikolomani',
      'Mumias West',
      'Mumias East',
      'Matungu',
      'Butere'
    ]
  }
];

export const POPULAR_HANDOVER_CENTRES = [
  { name: 'GPO Huduma Centre (Nairobi CBD)', county: 'Nairobi', type: 'Huduma Centre' },
  { name: 'City Square Huduma Centre (Haile Selassie Ave)', county: 'Nairobi', type: 'Huduma Centre' },
  { name: 'Eastleigh Huduma Centre', county: 'Nairobi', type: 'Huduma Centre' },
  { name: 'Kibra Huduma Centre', county: 'Nairobi', type: 'Huduma Centre' },
  { name: 'Mombasa Posta Huduma Centre', county: 'Mombasa', type: 'Huduma Centre' },
  { name: 'Nakuru Posta Huduma Centre', county: 'Nakuru', type: 'Huduma Centre' },
  { name: 'Kisumu Mega Plaza Huduma Centre', county: 'Kisumu', type: 'Huduma Centre' },
  { name: 'Eldoret Huduma Centre', county: 'Uasin Gishu', type: 'Huduma Centre' },
  { name: 'Thika Huduma Centre', county: 'Kiambu', type: 'Huduma Centre' },
  { name: 'Machakos Huduma Centre', county: 'Machakos', type: 'Huduma Centre' }
];
