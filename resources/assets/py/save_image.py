from PIL import Image
from urllib import urlopen
from StringIO import StringIO
  
'''
   Se descarga la imagen y se almacena en una cadena
'''
URL = 'http://www.url.com/img/imagen.jpg'
data = urlopen(URL).read() 
 
'''
   Se convierte a fichero con StringIO y luego se convierte en imagen
'''
file = StringIO(data) 
img = Image.open(file) 
 
'''
   Se almacena en disco
'''
img.save('/home/img/imagen.jpg')