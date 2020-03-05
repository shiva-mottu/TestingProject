import sys
import asyncio
import subprocess

fileName = sys.argv[1]
stems = sys.argv[2]

print("file Name: "+fileName)
print("stems : "+stems)

spleeter_cmd = "python -m spleeter separate -i  spleeter/songs/"+ fileName +" -p spleeter:"+stems+"stems -o output"
#subprocess.call(spleeter_cmd)
subprocess.Popen(spleeter_cmd,stdout=subprocess.PIPE, stderr=subprocess.PIPE,shell=True)
#subprocess.check_output(spleeter_cmd)
#subprocess.getoutput(spleeter_cmd)
print("Python end...")