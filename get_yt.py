import urllib.request, urllib.parse, re; 
queries=['4morant', 'in the h3art', 'join me in death him', 'nope your too late i already died', 'i want things to be beautiful']
for q in queries:
    html = urllib.request.urlopen('https://www.youtube.com/results?search_query=' + urllib.parse.quote(q)).read().decode('utf-8')
    match = re.search(r'"videoId":"(.*?)"', html)
    print(q + ": " + (match.group(1) if match else "None"))
