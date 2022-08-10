pip3 install virtualenv
# shellcheck disable=SC2046
virtualenv -p $(which python3.9) venv
source venv/bin/activate
pip install django
python -m pip install Pillow
pip install djangorestframework
pip install djangorestframework-simplejwt
python -m pip install django-cors-headers

python manage.py makemigrations
python manage.py migrate