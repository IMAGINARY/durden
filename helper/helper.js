/* globals paper */
import HelperSuperTile from '../src/helper-supertile';

//
// Setup range sliders
//
$('input[type=range]').each((i, range) => {
  const $range = $(range);
  const $label = $(`label[for=${$range.attr('id')}]`);
  if ($label.length) {
    const originalText = $label.text();
    $range.on('change', () => {
      $label.text(`${originalText} : ${$range.val()}`);
    });
    $range.trigger('change');
  }
});

//
// paper.js init
//
const canvas = document.getElementById('drawArea');
paper.setup(canvas);
paper.view.center = new paper.Point(0, 0);

const supertile = new HelperSuperTile();
window.supertile = supertile;

$('input[type=range]').on('change', () => {
  const bcdeLen = Number($('#bcdeLen').val());
  const ang0 = Number($('#ang0').val());
  const angB = Number($('#angB').val());

  supertile.transform(bcdeLen, angB);

  paper.view.update();
}).trigger('change');
