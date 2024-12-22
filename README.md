# CyberPass Scrabble Edition

Application URL: https://word-forge-pass-gen-johnkraus.replit.app/

Let's say you have to memorize a new password to authenticate to some system.

That password, which is taking up space in your brain and requires effort to memorize, is only good for one thing: authenticating to that system.

What if you could use that memorized password to multitask, to learn something new?

What if you could use that password to, say, improve your Scrabble game? Or learn a foreign language?

CyberPass creates strong passwords composed of useful information.  That useful information can be winning Scrabble words, foreign language vocabulary, or any other information you want to learn.  The customization possibilities are endless.


## Operating Instructions

1. Browse to CyberPass Scrabble Edition: https://word-forge-pass-gen-johnkraus.replit.app/

2. Optionally modify your password parameters.

   - Select the number of words in each password.
   - Specify how many alternative passwords to generate at a time.
   - Select the minimum and maximum number of characters in each word.  (The data set contains 65,000+ words having from 2-7 characters.)
   - Optionally change the delimiter character.
   - Optionally specify starting and ending letters for each word. (For example, enter "q" to generate words that start with "q".)

3. Click "Generate".  The application draws randomly from over 65,000 words having from 2-7 characters.

4. Click on a generated password to copy it to the clipboard.

5. Optionally, alter the generated password you selected by adding numbers, capital letters, or special characters, adding randomness to thwart attackers. Whatever works for you.  Use a separate text editor.

6. Paste the password into your login or password change form.  Try it here: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_login_form_modal

Check out the German vocabulary edition of CyberPass here: https://word-forge-pass-gen-german-johnkraus.replit.app/

CyberPass is an extension of the approach described in the XKCD Password Strength comic: https://xkcd.com/936/

I created CyberPass primarily by entering a series of prompts.  I added a file containing all the words having 2-7 characters in the Scrabble dictionary.  I added my own method of calculating entropy bits.  I also made a few manual modifications to the code and sometimes commented out the generated code or using css (display: none;) to hide elements I didn't want to use.
