from django.contrib import admin
from .models import Company, IPO, Document


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('company_name',)
    search_fields = ('company_name',)


@admin.register(IPO)
class IPOAdmin(admin.ModelAdmin):
    list_display = ('company', 'status', 'open_date',
                    'close_date', 'ipo_price')
    list_filter = ('status',)
    search_fields = ('company__company_name',)


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('ipo', 'rhp_pdf', 'drhp_pdf')
