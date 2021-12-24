run:
	ng serve --host 0.0.0.0



BASE_HREF = https://admin.grbpwr.com
build-static:
	ng build --base-href ${BASE_HREF} --configuration production --output-path=output

BASE_HREF_LOCAL = ./
build-static-local:
	ng build --base-href ${BASE_HREF_LOCAL} --configuration production --output-path=output