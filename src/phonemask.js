/**
 * Library: neovav/phonemask
 *
 * Source: https://github.com/neovav/phonemask
 *
 * Licensed (Apache 2.0)
 *
 * Copyright © Verveda Oleksandr Viktorovich <neovav@outlook.com>
 */
const phoneMask = function () {
    const parent = this

    let listDigits = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ]

    let listTags = []

    /**
     * Check if a phone format handler is assigned to the specified tag
     *
     * @param {HTMLInputElement} tag
     *
     * @return {boolean}
     */
    function checkEvent (tag) {
        let ret = false
        const keys = Object.keys(listTags)
        const len = keys.length
        for (let i = 0; i < len; i += 1) {
            const item = listTags[keys[i]]
            if (tag === item) {
                ret = true;
            }
        }
        return ret
    }

    /**
     * Getting the cursor position in a phone input field
     *
     * @param {HTMLInputElement} tag
     *
     * @return {int}
     */
    this.getCursorPosition = function ( tag ) {
        let CaretPos = 0;

        try {
            if (document.selection) {
                tag.focus ();
                const Sel = document.selection.createRange();
                Sel.moveStart('character', -ctrl.value.length);
                CaretPos = Sel.text.length;
            } else if ( tag.selectionStart || tag.selectionStart === '0' ) {
                CaretPos = tag.selectionStart;
            }
        } catch (e) {
            console.log(e)
        }

        return CaretPos;
    }

    /**
     * Setting the cursor position in the telephone input field
     *
     * @param {HTMLInputElement} tag
     * @param {int} pos
     */
    this.setCursorPosition = function(tag, pos) {
        try {
            if ( document.createRange ) {
                tag.setSelectionRange(pos, pos);
            } else if (document.createTextRange) {
                tag.focus();
                tag.collapse(false);
                tag.select();
            }
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * Search in a mask for a position to insert a digit
     *
     * @param {HTMLInputElement} tag
     * @param {string} mask
     * @param {int} step
     *
     * @return {int}
     */
    this.searchPosition = function (tag, mask, step = 1) {
        let ret = parent.getCursorPosition(tag)

        let arrMask = mask.split('')
        let len = arrMask.length

        let i = ret
        let isFirst = true

        while (i >= 0 && i <= len) {
            let char = arrMask[Math.min(i, i + step)]
            if (char === '_') {
                if (isFirst) {
                    ret = i + step
                } else {
                    ret = i
                }
                break
            }
            i += step
            isFirst = false
        }

        return ret
    }

    /**
     * Focus and click handler in the phone input field
     *
     * @param {HTMLInputElement} tag
     * @param {string} mask
     */
    function correctPosition (tag, mask) {
        try {
            let position = parent.getCursorPosition(tag)
            if (mask.substring(position, position + 1) !== '_') {
                let newPosition = parent.searchPosition(tag, mask, 1)
                if (position !== newPosition) {
                    parent.setCursorPosition(tag, newPosition)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * Handler for inserting text into a phone input field
     *
     * @param {ClipboardEvent} event
     * @param {HTMLInputElement} tag
     * @param {string} mask
     *
     * @return {void}
     */
    function paste (event, tag, mask) {
        let value = tag.getAttribute('value')
        let arrValue = value.split('');
        let paste = (event.clipboardData || window.clipboardData).getData('text')
        let pasteDigits = paste.replace(/\D/g,'')
        if (pasteDigits === '') {
            return
        }
        let pasteDigitsLen = paste.length
        let lenMask = mask.length
        let newPosition = parent.getCursorPosition(tag)

        let arrMask = mask.split('')
        let arrPaste = pasteDigits.split('')
        let pos = 0;

        for (let i = newPosition; i < lenMask; i += 1) {
            let char = arrMask[i]
            let charPaste = arrPaste[pos]
            if (char === '_' && charPaste !== '') {
                arrValue[i] = arrPaste[pos]
                pos += 1
                if (pos >= pasteDigitsLen) {
                    newPosition = i + 1
                    break
                }
            }
        }

        value = arrValue.join('')

        tag.setAttribute('value', value)
        tag.value = value

        parent.setCursorPosition(tag, newPosition)
    }

    /**
     * Handler for pressing a key in a phone input field
     *
     * @param {KeyboardEvent} event
     * @param {HTMLInputElement} tag
     * @param {string} mask
     *
     * @return {int}
     */
    function keyDown (event, tag, mask) {
        const lenMask = mask.length
        let position = parent.getCursorPosition(tag)
        let newPosition = position;
        const keyName = event.key;
        let value = tag.getAttribute('value')
        if (listDigits.includes(keyName)) {
            if (position < lenMask) {
                newPosition = parent.searchPosition(tag, mask, 1)
                if (position !== newPosition) {
                    const arrValue = value.split('');
                    if (Math.abs(position - newPosition) > 1) {
                        arrValue[newPosition] = keyName
                        newPosition += 1
                    } else {
                        arrValue[position] = keyName
                    }

                    value = arrValue.join('')

                    tag.setAttribute('value', value)
                    tag.value = value
                }
            }

        } else if (event.keyCode === 8 || event.keyCode === 46) {
            let step = 1
            if (event.keyCode === 8) {
                step = -1
            }
            newPosition = parent.searchPosition(tag, mask, step)
            if (Math.abs(position - newPosition) === 1) {
                const arrValue = value.split('');
                if (step === -1) {
                    arrValue[newPosition] = '_'
                } else {
                    arrValue[position] = '_'
                }

                value = arrValue.join('')

                tag.setAttribute('value', value)
                tag.value = value
            }
        } else if (event.keyCode === 37) {
            newPosition = parent.searchPosition(tag, mask, -1)
        } else if (event.keyCode === 39) {
            newPosition = parent.searchPosition(tag, mask, 1)
        }
        if (position !== newPosition) {
            parent.setCursorPosition(tag, newPosition)
        }
    }

    /**
     * Initialization of phone input field handlers
     *
     * @param {string} css
     *
     * @return {int}
     */
    this.init = function (css) {
        const list = document.querySelectorAll(css)
        const keys = Object.keys(list)
        const len = keys.length
        for (let i = 0; i < len; i += 1) {
            const tag = list[keys[i]]
            try {
                if (!checkEvent(tag)) {
                    const mask = tag.getAttribute('mask')
                    tag.value = mask

                    listTags.push(tag)
                    tag.addEventListener('paste', (event) => {
                        paste (event, tag, mask)
                        event.preventDefault();
                    })
                    tag.addEventListener('focus', () => {
                        correctPosition (tag, mask)
                        return true
                    })
                    tag.addEventListener('click', () => {
                        correctPosition (tag, mask)
                        return true
                    })
                    tag.addEventListener('keydown', (event) => {
                        if (event.key === 'v') {
                            return true
                        }

                        keyDown (event, tag, mask)

                        event.preventDefault()
                        return false
                    });
                }
            } catch (e) {
                console.log(e)
            }
        }

        return parent
    }
}