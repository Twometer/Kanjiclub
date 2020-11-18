# Rebuilds the flags json index file

import os 
import json

current_dir = os.path.dirname(os.path.realpath(__file__))
flags_dir = current_dir + "\\public\\img\\flags"

flags = []

for name in os.listdir(flags_dir):
    if name.endswith(".svg") and name != "world.svg":
        flags.append(name.replace(".svg", ""))

result = json.dumps(flags)

file = open(current_dir + "\\src\\assets\\flags.json", "w")
file.write(result)
file.close()