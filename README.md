# phonemask
Library for processing the phone input field in the web form. Only native javascript is used

Usage:
1. Adding a library to HTML

```js
<script type="application/javascript" src="src/phonemask.js"></script>
```

or

```js
<script type="application/javascript" src="src/phonemask.min.js"></script>
```

2. Adding a phone input field to HTML

```html
<input type="text" class="form-control" id="phone" name="phone" value="+38 (0__) ___ - __ - __" mask="+38 (0__) ___ - __ - __" placeholder="+38 (0__) ___ - __ - __">
```

3. Adding javascript code to initialize the phone input field handler by mask

```js
<script type="text/javascript">
    const cssPhone = 'input[name="phone"';
    (new phoneMask()).init(cssPhone);
</script>
```