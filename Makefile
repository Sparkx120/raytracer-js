##
# Raytracer-JS Babel and Closure Compiler build.
# 
# Build Environment GnuMake32 on Windows 10 with BabelJS (Node) and Google Closure Compiler and cygwin environment
##

ROOT = ./raytracer-js
LIBD = $(ROOT)/lib
OPTD = $(ROOT)/opt
OBJD = $(ROOT)/objects

STATIC_LIBS = $(ROOT)/static/Math3D.js
LIBS = $(LIBD)/Canvas2D.js $(LIBD)/Camera.js $(LIBD)/GenericObject.js $(LIBD)/Light.js $(LIBD)/Ray.js $(LIBD)/Raytracer.js
OPTS = $(OPTD)/fractal.js
OBJECTS = $(OBJD)/OmniLight.js $(OBJD)/Plane.js $(OBJD)/Sphere.js
DRIVER = $(ROOT)/driver.js

ES6C = babel

CLOSURE_CONF = --language_in=ECMASCRIPT6

es6:
	$(ES6C) $(STATIC_LIBS) $(LIBS) $(OBJECTS) $(DRIVER) > precomp1.js

closure: es6
	java -jar ./closure/compiler.jar $(CLOSURE_CONF) --js precomp1.js --js_output_file ./js/Raytracer.js 2> build_log.log


build: closure

release: build clean

clean:
	rm ./precomp1.js