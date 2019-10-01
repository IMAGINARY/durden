# Durden

Animated pentagonal tiling.

This browser-based library creates a pentagonal tiling and allows performing various animations and 
transformations on it.

[Demo](https://imaginary.github.io/durden/)

Durden implements a 
[Type 8 pentagonal tiling](https://en.wikipedia.org/wiki/Pentagonal_tiling#Kershner_(1968)_Types_6,_7,_8).

## Dependencies

This library requires [Paper.js](http://paperjs.org/) and [Tween.js](https://github.com/tweenjs/tween.js)
to be imported within the browser. 

Tested versions are included in the `vendor` directory:

- Paper.js: v0.12.3
- Tween.js: v18.3.1

## Usage

Check `index.html` for a simple example.

## Helper

In `helper/index.html` there's a handy example for further development. 

A single supertile is shown with slider controls for the B angle and the length of sides. Each outer vertex
in the supertile is colored for easy reference and the "North" vertex is bigger. A reference image of the
constraints of a type 8 pentagon is also included.

## Credits

Created by [Eric Londaits](https://github.com/elondaits) with the invaluable help of
[Aaron Montag](https://github.com/montaga) for IMAGINARY gGmbH. 

## License

Copyright (c) 2019 IMAGINARY
Licensed under the MIT license. See LICENSE file.
