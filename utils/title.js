const titles = [
  'This place is a message... and part of a system of messages... pay attention to it!',
  'Sending this message was important to us. We considered ourselves to be a powerful culture.',
  'This place is not a place of honor... no highly esteemed deed is commemorated here... nothing valued is here.',
  'What is here was dangerous and repulsive to us. This message is a warning about danger.',
  'The danger is in a particular location... it increases towards a center... the center of danger is here... of a particular size and shape, and below us.',
  'The danger is still present, in your time, as it was in ours.',
  'The danger is to the body, and it can kill.',
  'The form of the danger is an emanation of energy.',
  'The danger is unleashed only if you substantially disturb this place physically. This place is best shunned and left uninhabited.',
  'Something manmade is here and it is dangerous.',
  'Do not destroy this marker. This marking system has been designed to last 10,000 years. If the marker is difficult to read, add new markers in longer-lasting materials and copy this message in your language onto them.',
  'Do not drill here. Do not dig here. Do not do anything with the rocks or water in the area.',
  'This place is a burial place for radioactive wastes. We believe this place is not dangerous',
  'We are going to tell you what lies underground, why you should not disturb this place, and what may happen if you do.',
  'By giving you this information, we want you to protect yourselves and future generations from the dangers of this waste.',
  'The waste also contains hazardous materials, whose danger does not lessen with time.',
  'If you find unusual sickness in this region, or you find higher than normal levels of radioactivity in the area, inspect the area of the site.',
];
export const title = () => titles[Math.floor(Math.random() * titles.length)];
