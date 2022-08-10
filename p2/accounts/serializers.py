from django.contrib.auth import update_session_auth_hash
from django.core.validators import validate_email
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from accounts.models import User


class ProfileSerializer(serializers.ModelSerializer):
    # belongs = serializers.CharField(source='belongs.get_full_name', read_only=True)
    id = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ['id', 'avatar', 'phone_number', 'is_owner', 'address', 'first_name', 'last_name', 'email', 'username']
        # security_question = "1111"
        # extra_kwargs = {
        #     'security_question': {'read_only': True},
        #     'security_question_answer': {'write_only': True},
        #     'password2': {'write_only': True}
        # }


class ProfileEditSerializer(serializers.ModelSerializer):
    # belongs = serializers.CharField(source='belongs.get_full_name', read_only=True)
    id = serializers.ReadOnlyField()
    is_owner = serializers.ReadOnlyField()
    password = serializers.CharField(write_only=True, required=False)
    password2 = serializers.CharField(write_only=True, required=False)
    # restaurant = serializers.CharField(source='belongs.get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'phone_number', 'is_owner', 'address',
                  'first_name', 'last_name', 'email', 'password', 'password2']
        optional_fields = ['password', 'password2']
        # write_only_fields = ('password',)
        # extra_kwargs = {
        #     'security_question': {'read_only': True},
        #     'security_question_answer': {'write_only': True},
        #     'password2': {'write_only': True}
        # }

    '''
        if request.POST['password1'] == '':
            change_pass = False

        elif len(request.POST['password1']) < 8:
            password_errors += ["This password is too short. It must contain at least 8 characters"]
            errors = True

        elif request.POST['password1'] != request.POST['password2'] and request.POST['password1'] != '':
            password_errors += ["The two password fields didn't match"]
            errors = True
    '''

    def update(self, instance, validated_data):
        profile_data = validated_data
        password = None
        if validated_data.get('password'):
            self.context['request'].user.set_password(validated_data['password'])
            update_session_auth_hash(self.context['request'], self.context['request'].user)
            validated_data.pop('password')

        if not validated_data.get('avatar'):
            a = 0
            # validated_data.pop('avatar')
        else:
            self.context['request'].user.avatar.delete(save=True)

        instance = super(ProfileEditSerializer, self).update(instance, validated_data)
        return instance

        # profile_data = validated_data.pop('profile')
        # for attr, value in validated_data.items():
        #     if attr == 'password':
        #         instance.set_password(value)
        #     else:
        #         setattr(instance, attr, value)
        # instance.save()
        # if not hasattr(instance, 'profile'):
        #     MemberProfile.objects.create(user=instance, **profile_data)
        # else:
        #     #This is the code that is having issues
        #     profile = MemberProfile.objects.filter(user=instance)
        #     profile.update(**profile_data)

    def validate(self, data):
        if not data.get('password2'):
            data['password2'] = ''
        if not data.get('password'):
            data['password'] = ''
        print(len(data['password']))

        if len(data['password2']) != 0:
            if data['password2'] != data['password']:
                raise serializers.ValidationError("password dose not match")
            if len(data['password']) <= 8:
                raise serializers.ValidationError("password too short")
        else:
            if len(data["password"]) != 0:
                raise serializers.ValidationError("password did not match")
            else:
                # raise serializers.ValidationError("password did not match")
                data.pop("password2")
                data.pop("password")
        return data


# class LoginSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['username', 'password']
#

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'avatar', 'phone_number', 'address',
                  'first_name', 'last_name', 'email', 'password', 'password2']

    # def create(self, validated_data):
    #     return super().create(validated_data | {})
    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate(self, data):
        if len(data['password']) == 0 or len(data['password']) < 8:
            raise serializers.ValidationError("This password is too short. It must contain at least 8 characters.")
        if data['password2'] == '':
            raise serializers.ValidationError('Please repeat your password')
        elif data['password'] != data['password2'] and data['password'] != '':
            raise serializers.ValidationError("The two password fields didn't match")
        if data.get('email'):
            try:
                validate_email(data['email'])
            except ValidationError:
                raise serializers.ValidationError("Enter a valid email address")

        return data
