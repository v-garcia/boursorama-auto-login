// ==UserScript==
// @name        bourso_login
// @namespace   bourso_login
// @description Autologin for boursorama
// @include     https://clients.boursorama.com/connexion/*
// @version     1
// @grant       none
// @require     https://rawgit.com/Huddle/Resemble.js/master/resemble.js
// TODO : Opti don't search again for duplicate digits
// ==/UserScript==

// Credentials to change
const BOURSO_USR = 'CHANGEME';
const BOURSO_PWD = 'CHANGEME';

// Ref b64 pictures
const DIGIT_B64 = {
  0: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAABTUlEQVRYhe2VMUvDQBiGv1qRDlLESToEC+Kgq4OjODk4uLj5K/wFXRw6+BMcnfwFXXTuVEQ61UHqUByKYkhoepenDubgLE4mcA7fs1zycuR9OMJ9IoqiKH/CGHMA9IB34BW4SdO0FdrrB9baM8AslgAmWZbthPYTEZEkSbaApBB7y/P8Eug6caAf2lFERIArd4LW2lMvv/by45COTqhfnFw8HA5XXW6MOfR+gW5IRxERAaaFzJOfx3G86Ynele1ZKfsBEWkW66cfjsdj/32jbEkVok6o6YdRFPlyH2VLqhB9Ltbt0Wi05sJGo7Hr7XkpW1KF6L2ISK1WW2+32ycurNfr5+4Z6FXQU440TVtA9ss9mhfZoNPphNb8Js/zC2B5MC2A6Xw+3wvt9wNr7RHwUMz6CXA7m82i0F6KovwnHvcHVQwcRVEURVEURVEcX6CoEtS8wodyAAAAAElFTkSuQmCC',
  1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAp0lEQVRYhe3UPQoCMRCG4S+b1IKwR9hGC4u9gXgJGy/jnazE8wgKgmX+ZmwtBMEksuL3HGB4SYYBiIg+FmMcReSuqioih5qzu9IB58W+A4AQwspaezTGzMqzGgkhLEXkqk8m96Le+8E5dzLG9Kp6qRH1SnGotXYA0KvqLaW0qdDUTs55G2McAaDV11c32R39FobWxtDafiaUiOiN9XzHk0ZEREREf+cB+WBYm21Hoq4AAAAASUVORK5CYII=',
  2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAACgUlEQVRYhe2Yz2vTYBjH35YiQ8Y2RDwPD8ODf4B62EGGJ49DwYNITyIyRUSGB88OGbKTFA8ycAgZg3kYgiCmiOzQeJBRZMiwUlcKkpqUlCa8eb6vlyfjJU1BbJsyyBdCeJ/kfZ5Pn+f9lQpx3PVr4Vk+jTiL7y+mEidTpmMh3/dnAawB+Aagw1eFiJaq1Wph3HxCCCGIqAggUH0EoFyr1U7E+12n8+nOdgAlBuoCeEVEd4joEYAfESwR3U8VKkmWZRUAlHzfP6vbgyCY07K6kzpYfvruP5Ws3W6f0kDfjprrv0VED7XSL4+bJ1FSygsAupxN1/O8M+Nm6pGU8hIAV8vmtXEz9SgMw6thSF0NcmncTD0iotsAiMstiag4TP+5YTgBsJrL5R5EbaXUa6XUB63tFAqF7WHEGkj9diVtedofNEZ2aM2UKVOmlGQYRh7AIS/glfjzhEU+APA5CIK56B3bticBrAA44Od1AKvNZvPk0EDDMLyigwRBcC4OCsAFsM7XLts+CiGE4zgzAPbY9hPAFoB9bn+yLGs4H4EANtjpG76vJIAebZWtVmuKbXvcf43bm9HHnmmaeQAviGi5Xq9PPJ2+N9hOySXrAPjted5pABLAoWEYR44TMloBEBDRIoPWlVJqpIdoIioySImDvlNKqTAMF3TQhHH61ff9We4jAfwZGSQHKTPYZQa/ySAbOqheeinlPNu22MdoM8r/gvQ7vnVs255MAnVdd4Zt3xn0eZ8x+pKIHjcajYmBQInoSVRGbfytAzhQSikiuqWB6mP0C9t2hBDCcZyp2Kzf1GZ92TTNwSZSBCSlnI/9gBtRkAg0lm0JYDf1dTRTpkyZ0tVfxcGGaAq6A2oAAAAASUVORK5CYII=',
  3: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAC+ElEQVRYhe2ZS2gTURSGzx1KCa2U+mgo0pX42NQHovhCdNFV7VIEsYKIYLZVC7GL0lohPjalBUU36kKtFKRVigs3caMWfEEXUkvpYHQYJcZJIwmZ5PzjojM1mU6b5tEkxXwwDNx77jn/3PvfmRtCRERfjz2SqIAEbjzLmK8zvrWgNQtO57tIfgLbfc3l/YQVyp3utXL5Wigej28GcBvAFIAYgF8APjKzNxQK1ZVaHxERMfM5AAnDBhhzd2A6Eomsy7fOspfJc3PQMVYIsVMIUWUYRsgwjH4A5w3DuEqCVLN/U21tbUcu4p5cKqCNAoGAC8Ad+6zpur5jfnaB4YIVLDSxWKwpRWhfqfWkwcztzHyGmb0APpsip8LhcH2msftch4r3tgAQTttQwGNN0zKKLDp2oabYUVmWq0utLQ2/3y/19PRQKBSqY2aPJZaZvcsZ3zHWvXLLH41GNyaTyeNO7Zl2/UDr0eL4UtO0egATppj3APoS8YSHmbsATDOzJbSXiOjngbMZhf2QJ3MX/2KgU5od3L0ggaIoLgCjdl/aPDqhaZrjZ3RofG9xzwXJZLINwDCAAIA4gB8A3jCzR1EUV1HFlJwtQ73leyyrUGG18a1/7gvR0Oovm411auh3blpsL/EEgGkAPlVVa+wx1s8QM3bSKYdT/1JUZSl2lohGiMhFRPuFEF63292iquqRxsbG6HyMoBHDMKxhyiI5HPvzxv70sixXA3huno66nGIy5bDTcKstf+tZRU68/ncS13W92WwfT4kJA3iQcvmIiPx7NkhL9RcM+2xMPHVJqqrWmO0zVsxSHszHozkLJSLSdX2Xw4w6Fn4l35WyFabX+yQioosPRbol7l3rk4iIvv+5sMAr9iKqqtYAeLmYR6+8PZkxRzaI5QaaK5W66w8KIZoMw/gQDAYPu93uqC3GQpEk6XJKji+SJG3LRWw2Qi1fMYAZANeDweAap5jFPFpwT1ZYTaxvuV82Z4r/i7Htef6DslKc/jRTnsKy4S8+KzqkzShJEAAAAABJRU5ErkJggg==',
  4: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAB5UlEQVRYhe2XMWgUQRRAZ5cUIUoIViIi2AQhjZAila1YaWMrRNOLiHWaIJgiRZo0KSQBm2ssJEUQkRSSIoUgXJFYBDk8zvMCtyfZZS8771s4G5blTM67dTPGebDN5+/M48/f4a9SjnPC9L15/6wdHP8P3x97x/2WJMldERGtERERYOMs3XpSr9dHgX3JYKUo8NzIHVgrGsfxJBD/OnY9a60o8NaIbSmlVL+iE8n18u5TrfV9IxXHcXxDqf5FS6PVal0EvhqphTRunSiwZIQ+12q10TRuo+iRnMKwsqsr+8P38WmSRVV1ZNgFgIe94r7vv1RKKRH5BCwNu89fo+gedTOhw1YufNtx7ekYmGdzs+X2z6tbV/vasFqtjmitnwIfgQgIgPdJktxOc8wlv5t/Nxv/XU4hNJvNMeBD+qsBvAE2gCid6q0QBRbNBpvtdns8jXe73ZvAchiGlwcRnbnzoLj2eTG17QNfRETCMLxyUq6RCIC17FNmRY+AIC+VGT5287Ee497Aon9S9rrneeNRFF3LiK6LyHo+UUT2vBwnLax3Jos7/sw/+7sgCCbSeKfTudRPtUo7+kajMQZs5b76TeCHia1ZIarU8T36JHOPHgLbWutHlUrFt0b0n2A5ee3GLYfjPPATZLbmk5L6tv8AAAAASUVORK5CYII=',
  5: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAACvklEQVRYhe2WQUgUURjHv53WWgpKYoMIiYoK8RBGezKRiIjKU2Edgg6VdjDwVlCHqJNEh6KC6CCYdFHQCooKMdaKINggEpFYTHQLWUXcYdTZN/Pe/3WZlWEc3dXd2Z3SPyw7897jfb/3/9578xH5QJdbepXMc6Tyt7LUWN/owauOfwN0xXoy3vufr3AZmkgm18yYl8wiAG8KESer5VUXHvoiLYF8J5BSSuv/h5Tyvkv/2MvvX6MNkcPIN1ZeWmmKd61rKm6m7KDRaFQxTbNWCHGec340kUiEigqzlGygAwCGHAdpnHN+rNSMRJTTqdcZY/vzjZP3PpFStkspx6SU7aZpHkwmk5sYY7ullD1ERIFAIFRWVnY13zgF1+uqhEJEpGnaVpur70vNRYyxvUKIRmc757zOBtpZCrZ5pVKpzZkDBOCbEOKWEOIKgHsApjOgnPOGXOZ7HN7mzZWl63oFgIEsh6nNk+DLVTweX582eTOAPgCTAEwA0wB6hRA5Obm6VPP5tuu+2fHlTHE/gb9C4ysKWB854YuqqmDq7DvpnwXtZNeywnQcKnJde3GkriABRczwj9O+kHWZ/3Q+ExEJIW5abZ8GBweDzv6Mmk+9897VxUA550cACACjMzMzYWd/tXmpeCmf1IOKG+jc3Nx2AEkAs4ZhVLstKqPuLRPFAXYBHQbQL6WUQohzi431RC1NT4Nu7TV/Pixw1FaETGmaFl4O6On6Hu/ctYIP2UEBvM0Uyl1dXYpjrHeOOqWqajkRUTqd3mMF77eBDBMRAei23u+UBNQwjAMAVAAvACSsvXjdCaKqajmABADBOT9u61cBPLN+rZ6BMsYqrZpTs0BaY7FY0An6aHafYppmrXVFTeq6XuFSTLu6GwpvWPta+Vd3n29cS4+vVPfxhjcZaTs7kvPE4erRBWPjkcbVtVX+As6K/H0zxylJAAAAAElFTkSuQmCC',
  6: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAADEElEQVRYhe2XPWgUURDHJ8FAkCAR/EJEMIhaiIWFWFkEsRARQRAVC0EQUZQgfkQFObFQEEs7G7UQBVEQERElFmJhgkUIGkVEzpBIcnGXePv55rc2b2VdLn7kjlyC929u37y3b343NzPvnUhDDf2dLuxf3lxvBhERCfs7ZgaI1cGdq2cUz/QpDMOVwA1gCIiBYeBWGIar6s32U8aYTUA5qSDgQ6FQqDeiiOu67cDXDNjtOIgPA9cAX1X31ZtRRERUtTsDeSU7FwRBx4yIpogI8NJC+o7jtAdB0KGqu4wxm4vFYmu9+X4K+GZB+4GLgGYi/NUYs2XSd9eumb7Wk4IB/iTF5IdhuKZaP7X4Rt/tZytwxnXd+Z7nLU6S5CYJ0tTU1NrS0nKkBn6qE/DGRm4wa3ccpz0T1SfV+PDenas+oMAVC5NEUbQutcdxvCEDeqdqR9XKnkixBRo2oelW1W5gKAVV1d315hQREVXtqlRIFv7ejOmlIiLGmO3AC8AFQqBfVbt6enr+09tPQ7NBe9quzd78vHxqY/3hXy18P30QD04/q4mzbaOHpg8607TvZ+3A2/z5bsdqjOnM75GuGxkZmauq54EBwAfKQJ+qdvX29s6pBahfKpXaRESiKFqXsQ9WWDs0MTGxIA9aKpXagD47HgUeAk8AN724DAwMTA3WblC25/U+EZE4MpdSWyVQa3+YB81cXh6Nj4/PS+fL5fIi4LX1cey3QEcPPP8ln+4+P9ycc9KfOgc+AncUKv30n43yIes0s8fnJEkSz/OW5v2nNy3g5T/G8tdoqOpZIDTGdCZJkhhjdkySo4NRFK23Z32YpokFjYFvlfyMjY212XWfqgINgqDDPn8E3GKx2DoZqIiIqp6w47f5iPq+vyzvp2YRFRFJ8wi4teLe5ebfgRYKBQGeZosOuGqfnzqOM7Uc/RvQNErGmK35uUpjz/OWAKO5qk//tqRV/7iWVT8oIuL7/jKglG72J1AREWPMtnwfBdI+Gtpe2hdG0fGq+uhUtffLxfqf5w01NNt0/eRwo3Cy+gGo8V3tRSk6ewAAAABJRU5ErkJggg==',
  7: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAC/0lEQVRYhe2YwWsVVxSHz3sEkSDZxUUpCkUsdKEgpfgHZNGFi+DCQnGtIF2E4EaR9HUhLqKUUkTEVSkiBLqwUjAUakQkiAklyFvIo21kFg4JSZ40k2Tevee7LrwTL+MkLyGkE8p88GDumTu/c+bMmTP3PpENuPXweD1vmzv/6Qe2ijzfXTpUZanifw1ww3UBSHfq5796kdipQE920P/39fr8Jxe3Laiq9+r1+ou8vVarHa/VakN++McOYtxdgLvZo7fWfvntia/2XhtMkuQgkPr6bDUajbJDKgYYybKpqkPdryiBZrPZA7z22Uza7XZf2TEVoqpfB23pVtnxbAgwmQXa6XQ+KzueQowxnwfZfFR2PBsC/By0pNNlx1PI8vJy2JKiiYmJvdc3RURU9UrQki6XHU9FRUVFmRTseeaBO3Nzc70iInEc96rqCNAEVoEEmO4YMzw1NdXTRed2prOwsHAA+AGIgBT4Cxjd8orLi74BfvK/lrfd8OLTgeMHwDjwxtvGm81mTxed70Xe7wKAp8B9IPIfjAvbCfRlNk6S5KC3NYFRf/zb4uJiXzgHeB4uljfT8YH+CySzs7P7RN6tZVX17KY7gofy6/q3OXTQaDTEWjsY3Pkr55xbWVn5KK9hjPnCz5vsojPpA53x43+AH621p8LS2VJGQxR1gLPWDgIGWCq6Lo7j3syxiIiieSkHqLV2UESk0+kcy4INzkfGmBMiIpePXN98YVNQW6PGmJM+C6+cc251dfXjbL6qngHGrbUDWeYLdF4755y1diDvL0mWjqnqUFY6wOMtZzSsrRDgmj//e7vd7hsbG6sD973N+Bodzuuo6jk/vhnc4DdZAkTeLRX9nPX/Cc4/6N84q5sFGsdxL/Ak/9YHj24piqL9eZ1Wq7XPtyGTpumRbP0KOGASuBd0has7zmjmVFUvAjNBH/0TeAYspGl6tEhHVS942y8iIsaYk74tzQd9dCRrb7tGFEX719bWDu2qk4oCrgw+25v7qYqKbXJ44MB6Lb8F0/Id4MXZy3UAAAAASUVORK5CYII=',
  8: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAC7klEQVRYhe1YTUhUURQ+bwypkEiIiEHIRVALqXaFtNAWUtGq2pgtWkRFBIKIm4TchpCrVi4kw0UTVKASrsKVhAVCDSIiJTIp0mPGfG/em3n3fLdF98n1OaOjz/kR5tvM5dxz3vnOOffn3CEqI57NHI4EZeOdY1tk+4613rbiO9kJ89HW8pOoYhf4+vLRwajYzJnV4hPNZrPnAbwBsAggA8AGEAfQb1nWyaITKARCiGsAMjIPACQcx2nYd8djF64XXILege4IgFmN1CgzP2HmLgDfNfkr3e72u9rSrMfuxuSGIwC2IjOr69i2fUoPoCTEtgOAcUXGFkK09fX10dLS0mFm7vGJMnNXGB+1f46Er0A6nY4C+KJlbxnAuhpLAIPxePxQaEf7gWw22wTgZ46NNGFZ1oly8yMiIs/zmrV1ugZgEMBbAJ6SLVQEWb/sAJL6MSSEaNMy209E1Pr8V/luHwCOIjMfi8U2iLiu26gR/RTGB9c/DB9g4LycZOanzNwDYCHfOVoWCCGu+lnVwWB/1y+m0+lo0YncGGrZMe2u6zYCGFD3+zoAE8A3Zu5OpVLHi06yCiL6ODV+MPrPKqooJ9LDp0u/UfI8L+b0eQCJXHa+3L+lPM+7rOsw8x3/Rgva/z47sinYHSOXUg5LKYfV+K8avy840v92r4mIampq2nW5YRgdan4oaBOd68BufOjONmUyIN82o+rmkgCW/cYllUod81+spmnW6baDjxf3vnTCECUiAjAppZRCiBYiIma+r3RGCvFfskXvlz8SiXQQERmG0U5EBGBL2cM6yplR9WdDUpetrKwcDeqbplmndE3HcRoAMICE3sMWm+i0XlIiIma+p/Q/BHRH/EZa/b7YM6EHq/M5I8xHVAhxS81lAIwCmFDZYsu1mwO6G88TKaXMZDLn9kw0H/IRVQRuApgCkFS96GfP864E9WKxWARAQn1rWp+722VWu6kqSo6Ll4zKXXedTRVMriJR/8MtS8b+ATqYU28wh69LAAAAAElFTkSuQmCC',
  9: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAD40lEQVRYhe1XUWhcRRS9LCH0o7QSJZRgi0qRFIL0Q2oQP7RIkfxVRaSK9EO0SLGKtZQa20hcELRY8Ue/pEhZskGkSBERSWL0b0tda5AQ1A1LbZdNdtOXt+/lvZl7xg/vhGHZl26axY1lDyzs3Llz57x778y9Q5SA/lMDqaS5Djq4Bbb2/N2e9Dn2R9DJ23VBZUdvy2O+798D4BMA8wAiACUAmSiK+lvNcU28nT6W+AFBEOwAMG8aAEBNKTX4X3JNBIAvHGLTzHwUwFkASmSzuVyua8+eH9ub3wDKQmh+bm6u28qZ+XWAjTHGaK2H2smRiIgcz/3syoMg6HM8fbZd/OiFvR+liIgA/C5kmJmPLCwsbA3DcBeAMYfoxbYRtWDmowkHKXT+f99unkREBCBtU0CI3WTml5zx1xvdoyUn8c9z+94Nw3AnMz/DzAc9z9tpjLnhqPzWin02DN/3eyuVyjY7npycTAGYsh5VSu1rJ79VALggVWmUmV8DMO2E/bt28yMiopWVlQcANDpPBsBsEAR9Ldnoifz9G85TrfUQgB8ALEutnwWQdtNhwzhz+EyndUvClV8f2TzOefUds3nINIPt920i760Hd2dO/z+J37kYGRlZbYLDMLzXyqXiXLJjrfWQXOZTAEbrm45ardYLoAqA5X6tAqi5NpVSj8m6q8x8smG1MMYsLS3d1ZAsgIwxxjDzc0REURTtFoPL587nu0UnLTqnZmZmugDkpYt/WubHZE2aiIiZX5bxONFqH5AHYJRSg1rrpwCcd35XRL9aLBa3NCRqWzMAn8r4iC2PSqlHhciUjB8mIorj+CEASmsuMfMhWZ+3zxKJ1LR8zH7bvwL4vH5/z/N6AFwTRxxKDH+1/O/zAcBlIfUVgGkAZWYeFg+GABaz2ezq6WXm0059V3Ec73XtRlHU75TWKoBSo7ACGBcbY4kkHeWrALhSqWwDsAjgPQDjACaUUoNiKOOu8X2/13k7TSXYHbUfw8zP188z84uy/prneT3NEP1QjJ2QcD0uKRAx87DMHa5bk7GdvZvjLgqFQjeYDYC/6ufkjXUTgNFaH7glSSIirfWTsmkZQFgoFLqjKHpQZCVjjHFbN631szZd4jgekBAv1mq1HfW2bevnyrLZbArAhHs2mkKxWNxiH2aseIKI6NL25RSA62JsxurKVVQGEMVxPEBEZK8bAN80Q9SG3OamPf2s9Ze+7/euSRbAtxLCYUd2QYx97Mgu1uvlcrkuAJcbpUgC0eNJ92gURbvXdus6UXvz/U79bgpvvVJqqafGPyt0PH/n4sAHfU2H95eD6c2bCm8M/XRb5P4B71XZDxGbr8YAAAAASUVORK5CYII='
};

(function boursoAutoLogin() {
  const digitToButton = digit => {
    const referencePicture = DIGIT_B64[digit];
    const comparisons = digitImgs.map(elem => imageCompareWrapper(referencePicture, elem));

    return Promise.all(comparisons).then(values => {
      // Order images by reasemblence
      values.sort((a, b) => a.misMatchPercentage - b.misMatchPercentage);

      // Pick the button whit the most reasembling pic in the DOM
      const $targetPic = $pwdInput.find(`[data-matrix-key] img[src="${values[0].p2}"]`);

      log(`Letter ${digit}, code : ${$targetPic.parent().data('matrix-key')}`);
      return $targetPic;
    });
  };

  const imageCompareWrapper = (p1b64, p2b64) => {
    return new Promise(function(resolve, reject) {
      try {
        resemble(p1b64)
          .compareTo(p2b64)
          .ignoreAntialiasing()
          .onComplete(r => resolve({ ...r, p1: p1b64, p2: p2b64 }));
      } catch (exception) {
        reject(exception);
      }
    });
  };

  const $pwdInput = $('ul.password-input');

  const log = msg => console.log(`bourso_login : ${msg}`);

  if (!$pwdInput.length || !document.URL.endsWith('/connexion/')) {
    log('Virtual keyboard is NOT ready, retrying');
    window.setTimeout(boursoAutoLogin, 500);
    return;
  }

  log('Virtual keyboard is ready');

  // Set userName
  $('#form_login').val(BOURSO_USR);

  // Get button base64 images
  const digitImgs = $pwdInput
    .find('[data-matrix-key] img')
    .map((x, y) => $(y).attr('src'))
    .get();

  // Get DOM buttons that match digit images (Array<Promises>)
  const digitBtns = [...BOURSO_PWD].map(digitToButton);

  // Click on these buttons in order
  Promise.all(digitBtns).then(btnList => {
    btnList.forEach(b => b.click());
    log('Form submiting');
    $('.js-form-login').submit();
  });
})();
