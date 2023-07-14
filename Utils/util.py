import os
import json

path =r"\\lab1.hdc.mdsol.com\softwareinstallations\SDLC\Rave\release"

filelist = os.listdir(path)

filelist.remove('test2')
filelist.remove('20170419-76cacaf')
filelist.remove('release')

finalData = []

for dir in filelist:
    root = os.path.join(path,dir)
    subDir = []
    for r in os.listdir(root):
        g = os.path.join(root,r)
        subDir.append([os.path.getmtime(g),r,dir])
    subDir.sort(key=lambda x: x[0],reverse=True)
    # print(subDir)
    h = os.listdir(os.path.join(root,subDir[0][1]))
    h = list(filter(lambda x: x[-4:]==".zip",h))
    artifacts = ",".join(h)
    finalData.append({
        "version":subDir[0][2],
        "artifact":subDir[0][1],
        "artifactItems":artifacts
    })

# print(finalData)

f = open('legacy_data.json',"w")

f.write(json.dumps(finalData))

f.close()