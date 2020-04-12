import sys
import subprocess

fileName = sys.argv[1]
stems = sys.argv[2]

print("file Name: "+fileName)
print("stems : "+stems)

spleeter_cmd = "python -m spleeter separate -i  public/songs/"+ fileName +" -p spleeter:"+stems+"stems -o public/multitrack"
#subprocess.call(spleeter_cmd)
subprocess.Popen(spleeter_cmd,stdout=subprocess.PIPE, stderr=subprocess.PIPE,shell=True)
#subprocess.check_output(spleeter_cmd)
#subprocess.getoutput(spleeter_cmd)
print("spleeter tool split the file asynchronously")