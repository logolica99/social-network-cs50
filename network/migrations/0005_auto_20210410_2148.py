# Generated by Django 3.1.7 on 2021-04-10 15:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_auto_20210410_2140'),
    ]

    operations = [
        migrations.AlterField(
            model_name='posts',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='network.user'),
        ),
    ]