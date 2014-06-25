
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Surface = require('famous/core/Surface');

    /**
     * A surface containing image content.
     *   This extends the Surface class.
     *
     * @class ImageSurface
     *
     * @extends Surface
     * @constructor
     * @param {Object} [options] overrides of default options
     */
    function ImageSurface(options) {
        this._imageUrl = undefined;
        Surface.apply(this, arguments);
    }

    ImageSurface.cache = {};

    ImageSurface.cacheEnabled = true;

    ImageSurface.enableCache = function enableCache() {
        ImageSurface.cacheEnabled = true;
    };

    ImageSurface.disableCache = function disableCache() {
        ImageSurface.cacheEnabled = false;
    };

    ImageSurface.clearCache = function clearCache() {
        ImageSurface.cache = {};
    };

    ImageSurface.prototype = Object.create(Surface.prototype);
    ImageSurface.prototype.constructor = ImageSurface;
    ImageSurface.prototype.elementType = 'img';
    ImageSurface.prototype.elementClass = 'famous-surface';

    /**
     * Set content URL.  This will cause a re-rendering.
     * @method setContent
     * @param {string} imageUrl
     */
    ImageSurface.prototype.setContent = function setContent(imageUrl) {
        if (this._imageUrl && this._imageUrl !== imageUrl) {
            if (this.constructor.cache[this._imageUrl].count === 1)
                this.constructor.cache[this._imageUrl] = null;
            else
                this.constructor.cache[this._imageUrl].count--;
        }

        if (!this.constructor.cache[imageUrl])
            this.constructor.cache[imageUrl] = {count: 1, node: null};
        else
            this.constructor.cache[imageUrl].count++;

        this._imageUrl = imageUrl;
        this._contentDirty = true;
    };

    /**
     * Place the document element that this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    ImageSurface.prototype.deploy = function deploy(target) {
        if (!this.constructor.cache[this._imageUrl].node && ImageSurface.cacheEnabled) {
            var img = new Image();
            img.src = this._imageUrl;
            this.constructor.cache[this._imageUrl].node = img;
        }

        target.src = this._imageUrl || '';
    };

    /**
     * Remove this component and contained content from the document
     *
     * @private
     * @method recall
     *
     * @param {Node} target node to which the component was deployed
     */
    ImageSurface.prototype.recall = function recall(target) {
        target.src = '';
    };

    module.exports = ImageSurface;
});
