# Generated by Django 4.1.4 on 2022-12-29 23:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_address_avg_gas_alter_address_foot_traffic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='avg_gas',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
