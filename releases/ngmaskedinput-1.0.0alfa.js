var ngMaskedInput = angular.module("ngMaskedInput", [ "ngMaskedInputServices" ]);

ngMaskedInput.directive("mask", [ "MaskedInput", function(a) {
    "use strict";
    return {
        require: "?ngModel",
        scope: !1,
        link: function(b, c, d, e) {
            e && (c.bind("blur", function() {
                e.$viewValue && b.$apply(-1 === e.$viewValue.indexOf("_") ? function() {
                    b[d.ngModel] = c.val();
                } : function() {
                    c.val("");
                });
            }), c.on("keydown", function(b) {
                8 === b.which ? a.userOperation = 8 : 46 === b.which && (a.userOperation = 46);
            }), e.$parsers.unshift(function(b) {
                return b && (b = a.getNewViewValue(b, c, d, e)), b;
            }));
        }
    };
} ]);
function MaskedInputClass() {
    "use strict";
    this.validChars = [ "A", "9", "*" ], /*
     * Search in mask the first valid position
     *
     * @param {String} string
     */
    this.findFirstIndex = function(a) {
        var b = [ a.indexOf("A"), a.indexOf("9"), a.indexOf("*") ].sort(), c = b.lastIndexOf(-1);
        return -1 !== c ? b[c + 1] : b[0];
    }, /*
     * Search in mask the last valid position
     *
     * @param {String} string
     */
    this.findLastIndex = function(a) {
        var b = [ a.lastIndexOf("A"), a.lastIndexOf("9"), a.lastIndexOf("*") ].sort().reverse();
        return b[0];
    }, /*
     * When the User deletes a character of mask we need modify the
     * input, deleting the correct character. This function returns the
     * modified view.
     *
     * @param {viewValue} string
     * @param {Object} attrs
     */
    this.getViewValueAfterOperation = function(a, b) {
        // Delete key code
        // Backspace
        // Backspace key code
        return -1 === this.validChars.indexOf(b.mask[this.cursor]) && (46 === this.userOperation ? (this.flux = 2, 
        a = a.substring(0, this.cursor) + a.substring(this.cursor + this.findFirstIndex(b.mask.substring(this.cursor)))) : a = a.substring(0, this.findLastIndex(b.mask.substring(0, this.cursor))) + a.substring(this.cursor)), 
        8 === this.userOperation && (this.flux = 3), this.userOperation = void 0, a;
    }, /*
     * After changes input value the cursor is assigned to last position
     * of input, this function puts him to correct position
     *
     * @param {Object} elem
     * @param {Object} attrs
     * @param {String} newViewValue
     */
    this.setcursor = function(a, b, c) {
        /*
         * this.flux is the code of procedure realized by function:
         * - 0 user data is invalid
         * - 1 is First insert of data
         * - 2 is Delete operation
         * - 3 is Backspace operation
         * - 4 is Normal Flux
         */
        switch (this.flux) {
          case 0:
            a[0].selectionStart = this.cursor - 1;
            break;

          case 1:
            a[0].selectionStart = this.findFirstIndex(b.mask) + 1;
            break;

          case 2:
            a[0].selectionStart = this.cursor;
            break;

          case 3:
            a[0].selectionStart = this.findLastIndex(b.mask.substring(0, this.cursor + 1)), 
            // Position can be a different of valid field for user
            "_" !== c[a[0].selectionStart] && a[0].selectionStart++;
            break;

          default:
            // Last position of input
            if (void 0 === b.mask[this.cursor]) a[0].selectionStart = this.cursor; else if (-1 === this.validChars.indexOf(b.mask[this.cursor])) {
                var d = this.cursor + this.findFirstIndex(b.mask.substring(this.cursor));
                a[0].selectionStart = "_" !== c[d] && void 0 !== c[d] ? d + 1 : d;
            } else a[0].selectionStart = -1 === this.validChars.indexOf(b.mask[this.cursor - 1]) && void 0 !== c[this.cursor] ? this.cursor + 1 : this.cursor;
        }
        this.flux = void 0, a[0].selectionEnd = a[0].selectionStart;
    }, /*
     * Main function, checks the data inserted by user and defines the
     * element value to it
     *
     * @param {string} viewValue
     * @param {Object} elem
     * @param {Object} attrs
     * @param {Object} ctrl
     */
    this.getNewViewValue = function(a, b, c, d) {
        var e;
        this.cursor = b[0].selectionStart;
        var f = c.mask.replace(new RegExp("[A9*]", "g"), "_");
        1 === a.length && (this.flux = 1), void 0 !== this.userOperation && (a = this.getViewValueAfterOperation(a, c));
        var g = a.replace(/[\W_]/gi, "");
        e = f;
        for (var h = 0; h < g.length; h++) {
            if ("9" === c.mask[e.indexOf("_")]) {
                if (!Boolean(parseInt(g[h]))) {
                    this.flux = 0;
                    continue;
                }
            } else if ("A" === c.mask[e.indexOf("_")] && Boolean(parseInt(g[h]))) {
                this.flux = 0;
                continue;
            }
            e = e.replace("_", g[h]);
        }
        return e === f ? (b.val(""), d.$viewValue = "") : (b.val(e), this.setcursor(b, c, e), 
        d.$viewValue = e), "";
    };
}

var ngMaskedInputServices = angular.module("ngMaskedInputServices", []);

ngMaskedInputServices.factory("MaskedInput", function a() {
    "use strict";
    return new MaskedInputClass();
});